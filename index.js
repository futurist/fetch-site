const {URL} = require('url')
const fs = require('fs')
const {join:joinPath, dirname, extname} = require('path').posix
const {promisify} = require('util')
const puppeteer = require('puppeteer')
const makeDir = require('make-dir')
const isBase64 = require('is-base64')
const mime = require('mime-types')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const renameFile = promisify(fs.rename)
const {assign} = Object

async function main({
  dir,
  url,
  shot,
  waitFor,
  onResponse,
  indexFile = 'index.html',
  launchOption,
  openOption,
  onBeforeOpen,
  onAfterOpen,
  onFinish,
}={}) {
  // check options
  if(!url) throw 'url cannot be empty'
  // 1. puppeteer cannot run inside Docker, since the sandbox
  // launchOption = assign({args: ['--no-sandbox']}, launchOption)
  // 2. shot will add await so `load` event not accurate
  // shot = shot || 'screenshot.png'
  openOption = assign({waitUntil: 'networkidle2'}, openOption)
  url = ensureHTTP(url)
  if(!dir){
    dir = hostDir(new URL(url).host)
  }

  // launch puppeteer
  const browser = await puppeteer.launch(launchOption)
  await makeDir(dir)
  const page = await browser.newPage()
  page.fetchSite = {}
  const responseData = page.fetchSite.responseData = []

  // response hook
  const responseHook = page.fetchSite.responseHook = async response => {
    const req = response.request()
    let url = response.url()
    const request = {
      method: req.method(),
      headers: req.headers(),
      postData: req.postData(),
      resourceType: req.resourceType(),
    }
    // const reqUrl = req.url()
    // if(reqUrl != url) request.url = reqUrl
    const data = {
      url,
      file: '',  // optimize v8 hidden class
      status: response.status(),
      ok: response.ok(),
      headers: response.headers(),
      request
    }
    if((/^data:/i.test(url))
      || onResponse && await onResponse(data, page)===false
    ) return
    let body
    try{
      body = await response.buffer()
    }catch(e){
      // for 301/302 redirect, will throw no_body
      responseData.push(data)
      return
    }
    // reset url from onResponse
    if(url!==data.url) {
      data.realUrl = url
      url = data.url
    }
    const contentType = data.headers['content-type']
    const extension = mime.extension(contentType) // inferred from mime
    const charset = mime.charset(contentType)
    const {pathname, protocol, host} = new URL(url)
    const pathArr = [
      hostDir(protocol, ''),
      hostDir(host),
    ].concat(
      /^blob/.test(protocol)  // url as a whole
        ? safePath(pathname)
        : ensureIndex(pathname, indexFile).split('/').map(safePath)
    )

    // push data
    const file = data.file = joinPath(...pathArr)
    responseData.push(data)

    // write to file
    const writeOption = {
      encoding: toNodeEncoding(charset)
    }
    let filePath = joinPath(dir, file)
    await ensureFolder(filePath, indexFile)
    try{
      let stat = fs.lstatSync(filePath)
      if (stat.isDirectory()) {
        filePath = joinPath(filePath, indexFile)
      }
      stat = fs.lstatSync(filePath)
      if(stat.isFile()) {
        if(body.equals(await readFile(filePath))){
          // it's same file, do nothing
          return
        }
        const suffix = '.'+(+new Date).toString(36)
        filePath += suffix
        data.file += suffix
      }
    }catch(e){
      // ENOENT -2 (not exists) is OK
    }
    await writeFile(filePath, body, writeOption)
  }
  page.on('response', responseHook)

  // goto url
  onBeforeOpen && await onBeforeOpen(page)
  await page.goto(url, openOption)
  onAfterOpen && await onAfterOpen(page)
  waitFor != null && await page.waitFor(waitFor)
  shot && await page.screenshot({
    path: joinPath(dir, shot)
  })

  // finish work
  await browser.close()
  await writeFile(joinPath(dir,'response.json'), JSON.stringify(responseData), 'utf8')
  onFinish && await onFinish(page)
  return {
    dir,
    url,
    data: responseData
  }
}

process.on('unhandledRejection', console.log)

async function ensureFolder(filePath, indexFile) {
  try{
    await makeDir(dirname(filePath))
  } catch(e){
    let {code, path} = e
    if(!path) return
    // e.g. exist file: xx/abc
    // folder to create: xx/abc/x/y
    // will throw errno:-20
    if(code==='ENOTDIR') {
      await ensureFolder(path, indexFile)
    }
    // folder to create: xx/abc/x
    // will throw errno:-17
    if(code==='EEXIST') {
      const tempPath = path +
        Math.random().toString(36).slice(1)
      await renameFile(path, tempPath)
      await makeDir(path)
      await renameFile(tempPath, joinPath(path, indexFile))
    }
    await ensureFolder(filePath, indexFile)
  }
}

function hostDir(host, replacement = '_') {
  return host.replace(':', replacement)
}

// prevent multiple escape % as %25
function safePath (url) {
  return encodeURIComponent(url).replace(/%25/g, '%')
}

function ensureHTTP(url){
  return !/^https?:\/\//i.test(url)
    ? 'http://'+url
    : '' + url
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

