const {parse:parseUrl} = require('url')
const fs = require('fs')
const path = require('path')
const util = require('util')
const puppeteer = require('puppeteer')
const makeDir = require('make-dir')
const isBase64 = require('is-base64')
const writeFile = util.promisify(fs.writeFile)

async function main({
  dir,
  url,
  shot,
  filter,
  indexFile,
  launchOption,
  openOption,
  onBeforeOpen,
  onAfterOpen,
  onFinish,
}={}) {
  if(!dir) throw 'dir cannot be empty'
  const browser = await puppeteer.launch(launchOption)
  const responseData = []
  await makeDir(dir)
  const page = await browser.newPage()
  page.on('response', async response => {
    const data = {
      url: response.url(),
      status: response.status(),
      ok: response.ok(),
      headers: response.headers(),
    }
    const request = response.request()
    data.request = {
      method: request.method(),
      headers: request.headers(),
      postData: request.postData(),
      resourceType: request.resourceType(),
    }
    if(isBase64(data.url)
      || filter && await filter(data, page)===false
    ) return
    let body
    try{
      body = await response.buffer()
    }catch(e){
      // for 301/302 redirect, will throw no_body
      return
    }
    const {pathname, protocol, host} = parseUrl(data.url)
    const filePath = ensureIndex(
      path.join(
        dir,
        encodeURIComponent(protocol + host),
        pathname.split('/').map(encodeURIComponent).join('/')
      ),
      indexFile
    )
    await makeDir(path.dirname(filePath))
    await writeFile(filePath , body)
    responseData.push(data)
  })
  onBeforeOpen && await onBeforeOpen(page)
  await page.goto(url, openOption)
  onAfterOpen && await onAfterOpen(page)
  shot && await page.screenshot({
    path: path.join(dir, shot)
  })
  await browser.close()
  await writeFile(path.join(dir,'response.json'), JSON.stringify(responseData), 'utf8')
  onFinish && await onFinish(page)
}

process.on('unhandledRejection', console.log)

function ensureIndex(filePath, defaultName='index.html'){
  if(filePath.endsWith('/')) filePath += defaultName
  return filePath
}

module.exports = main

/* Usage:
main({
  url: 'http://www.baidu.com',
  shot: 'shot.png',
  dir: 'baidu.com',
  launchOption:{
    headless: false
  },
  openOption:{
    timeout: 100*1e3,
    waitUntil: 'networkidle0'
  },
  filter: response=>{
    if(/his/.test(response.url)) return false
  },
  onBeforeOpen: async page=>{
    page.setViewport({width: 1440, height: 1000})
  },
  onAfterOpen: async page=>{
    await new Promise(r=>setTimeout(r, 5000))
  },
  onFinish: async page=>console.log('ok')
})
*/
