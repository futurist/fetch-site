const {URL} = require('url')
const fs = require('fs')
const {join:joinPath, dirname} = require('path')
const {promisify} = require('util')
const puppeteer = require('puppeteer')
const makeDir = require('make-dir')
const isBase64 = require('is-base64')
const mime = require('mime-types')
const writeFile = promisify(fs.writeFile)

async function main({
  dir,
  url,
  shot='screenshot.png',
  filter,
  indexFile,
  launchOption,
  openOption,
  onBeforeOpen,
  onAfterOpen,
  onFinish,
}={}) {
  if(!dir||!url) throw 'dir and url cannot be empty'
  const browser = await puppeteer.launch(launchOption)
  const responseData = []
  await makeDir(dir)
  const page = await browser.newPage()
  page.on('response', async response => {
    const request = response.request()
    const url = response.url()
    const headers = response.headers()
    const data = {
      url,
      file: '',  // optimize v8 hidden class
      status: response.status(),
      ok: response.ok(),
      headers,
      request: {
        method: request.method(),
        headers: request.headers(),
        postData: request.postData(),
        resourceType: request.resourceType(),
      }
    }
    if(isBase64(url)
      || filter && await filter(data, page)===false
    ) return
    let body
    try{
      body = await response.buffer()
    }catch(e){
      // for 301/302 redirect, will throw no_body
      return
    }
    const contentType = headers['content-type']||'text/plain'
    const extension = mime.extension(contentType) // inferred from mime
    const charset = mime.charset(contentType)
    const {pathname, protocol, host} = new URL(url)
    const file = data.file = ensureIndex(joinPath(
      protocol.replace(':',''),
      encodeURIComponent(host),
      /^blob/.test(protocol)  // url as a whole
        ? encodeURIComponent(pathname)
        : pathname.split('/').map(encodeURIComponent).join('/')
    ), indexFile)
    const filePath = joinPath(dir, file)
    responseData.push(data)
    await makeDir(dirname(filePath))
    await writeFile(filePath, body, {encoding: toNodeEncoding(charset)})
  })
  onBeforeOpen && await onBeforeOpen(page)
  await page.goto(url, openOption)
  onAfterOpen && await onAfterOpen(page)
  shot && await page.screenshot({
    path: joinPath(dir, shot)
  })
  await browser.close()
  await writeFile(joinPath(dir,'response.json'), JSON.stringify(responseData), 'utf8')
  onFinish && await onFinish(page)
}

process.on('unhandledRejection', console.log)

function ensureIndex(filePath, defaultName='index.html'){
  if(filePath.endsWith('/')) filePath += defaultName
  return filePath
}

function toNodeEncoding(enc){
  return enc && typeof enc==='string'
    ? enc.toLowerCase().replace('-', '')
    : 'utf8'
}

module.exports = main

