const {URL} = require('url')
const fs = require('fs')
const {join:joinPath, dirname} = require('path').posix
const {promisify} = require('util')
const puppeteer = require('puppeteer')
const makeDir = require('make-dir')
const isBase64 = require('is-base64')
const mime = require('mime-types')

const writeFile = promisify(fs.writeFile)
const renameFile = promisify(fs.rename)
const {assign} = Object

async function main({
  dir,
  url,
  shot,
  onResponse,
  indexFile = 'index.html',
  launchOption,
  openOption,
  onBeforeOpen,
  onAfterOpen,
  onFinish,
}={}) {
  // check options
  if(!dir||!url) throw 'dir and url cannot be empty'
  // 1. puppeteer cannot run inside Docker, since the sandbox
  // launchOption = assign({args: ['--no-sandbox']}, launchOption)
  // 2. shot will add await so `load` event not accurate
  // shot = shot || 'screenshot.png'
  openOption = assign({waitUntil: 'networkidle2'}, openOption)

  // launch puppeteer
  const browser = await puppeteer.launch(launchOption)
  await makeDir(dir)
  const page = await browser.newPage()
  page.fetchSite = {}
  const responseData = page.fetchSite.responseData = []

  // response hook
  const responseHook = page.fetchSite.responseHook = async response => {
    const request = response.request()
    let url = response.url()
    const data = {
      url,
      file: '',  // optimize v8 hidden class
      status: response.status(),
      ok: response.ok(),
      headers: response.headers(),
      request: {
        method: request.method(),
        headers: request.headers(),
        postData: request.postData(),
        resourceType: request.resourceType(),
      }
    }
    if(isBase64(url)
      || onResponse && await onResponse(data, page)===false
    ) return
    let body
    try{
      body = await response.buffer()
    }catch(e){
      // for 301/302 redirect, will throw no_body
      return
    }
    // reset url from onResponse
    if(url!==data.url) {
      data.reqUrl = url
      url = data.url
    }
    const contentType = data.headers['content-type']
    const extension = mime.extension(contentType) // inferred from mime
    const charset = mime.charset(contentType)
    const {pathname, protocol, host} = new URL(url)
    const pathArr = [
      protocol.replace(':',''),
      encodeURIComponent(host),
    ].concat(
      /^blob/.test(protocol)  // url as a whole
        ? encodeURIComponent(pathname)
        : ensureIndex(pathname, indexFile).split('/').map(encodeURIComponent)
    )

    // push data
    const file = data.file = joinPath(...pathArr)
    responseData.push(data)

    // write to file
    const filePath = joinPath(dir, file)
    await ensureFolder(filePath)
    const writeOption = {encoding: toNodeEncoding(charset)}
    try{
      await writeFile(filePath, body, writeOption)
    }catch(e){
      // write to folder as file
      // throw errno:-21 EISDIR
      const {code, path} = e
      if(code==='EISDIR'){
        await writeFile(joinPath(filePath, indexFile), body, writeOption)
      }
    }
  }
  page.on('response', responseHook)

  // goto url
  onBeforeOpen && await onBeforeOpen(page)
  await page.goto(url, openOption)
  onAfterOpen && await onAfterOpen(page)
  shot && await page.screenshot({
    path: joinPath(dir, shot)
  })

  // finish work
  await browser.close()
  await writeFile(joinPath(dir,'response.json'), JSON.stringify(responseData), 'utf8')
  onFinish && await onFinish(page)
}

process.on('unhandledRejection', console.log)

async function ensureFolder(filePath, indexFile) {
  try{
    await makeDir(dirname(filePath))
  } catch(e){
    let {code, path} = e
    console.log(e)
    // e.g. exist file: xx/abc
    // folder to create: xx/abc/x/y
    // will throw errno:-20
    if(code==='ENOTDIR'){
      await ensureFolder(path, indexFile)
    }
    // folder to create: xx/abc/x
    // will throw errno:-17
    if(code==='EEXIST'){
      const tempPath = path + Math.random()
      await renameFile(path, tempPath)
      await makeDir(path)
      await renameFile(tempPath, joinPath(path, indexFile))
    }
    await ensureFolder(filePath, indexFile)
  }
}

function ensureIndex(filePath, indexFile){
  if(filePath.endsWith('/')) filePath += indexFile
  return filePath
}

function toNodeEncoding(enc){
  return enc && typeof enc==='string'
    ? enc.toLowerCase().replace('-', '')
    : 'utf8'
}

module.exports = main

