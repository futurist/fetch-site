const {URL} = require('url')
const fs = require('fs')
const {join:joinPath, dirname, extname} = require('path').posix
const {promisify} = require('util')
const puppeteer = require('puppeteer')
const makeDir = require('make-dir')
const mime = require('mime-types')
const revisionHash = require('rev-hash');

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const renameFile = promisify(fs.rename)
const {assign} = Object

async function main({
  dir,
  url,
  shot,
  userAgent,
  viewport,
  timeout,
  cookies,
	launchOption,
	extensionDir,
  waitFor,
  onResponse,
  indexFile = 'index.html',
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

	try{
		const baseDir = joinPath(__dirname, 'extensions')
		const extensionName = fs.readdirSync(baseDir).filter(v=>fs.lstatSync(joinPath(baseDir, v)).isDirectory())[0]
		if(extensionName){
			extensionDir = joinPath(baseDir, extensionName)
		}
	}catch(e){}
	const CRX_PATH = extensionDir
	// launch puppeteer
	launchOption = assign({
		defaultViewport: viewport,
		handleSIGINT: false,
		ignoreHTTPSErrors: true,
		args: [
			userAgent && `--user-agent=${userAgent}`,
			'--disable-infobars',
      '--no-sandbox',
			'--disable-setuid-sandbox',
			'--ignore-certifcate-errors',
			'--ignore-certifcate-errors-spki-list',
      // '--disable-web-security',
      '--enable-devtools-experiments',
      // '--auto-open-devtools-for-tabs',
      extensionDir && `--disable-extensions-except=${CRX_PATH}`,
      extensionDir && `--load-extension=${CRX_PATH}`
    ].filter(Boolean)
	}, launchOption)
  let browser = await puppeteer.launch(launchOption)
  await makeDir(dir)
	const page = (await browser.pages())[0] || await browser.newPage()
	const responseData = []

	const writeData = async ({page, url, data, getBuffer})=>{
    if((/^data:/i.test(url))
      || onResponse && await onResponse(data, page)===false
		) return

		// if(!page.isRoot) console.log(url)

    let body
    try{
      body = await getBuffer()
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
		const pathArr = urlToPath(url, indexFile)
    if(!pathArr) return

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
		try {
			await writeFile(filePath, body, writeOption)
		} catch(e) {
			/**
			 * Error: ENOTDIR: not a directory
			 * errno: -20, code: 'ENOTDIR', syscall: 'open',
			 */
			const name = revisionHash(body)
			const file = data.file = joinPath('conflicts', name)
			filePath = joinPath(dir, file)
			await ensureFolder(filePath, indexFile)
			await writeFile(filePath, body, writeOption)
		}
	}
  // response hook
  const responseHook = page => async response => {
    const req = response.request()
		let url = response.url()
    const request = {
      method: req.method(),
      headers: req.headers(),
      postData: req.postData(),
      resourceType: req.resourceType(),
      // redirects: req.redirectChain().map(v=>v.url())
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
		await writeData({
			page,
			data,
			url,
			getBuffer: ()=>{
				return response.buffer()
			}
		})
	}
	const whenClose = page => new Promise(res=>{
    page.on('close', res)
    page.on('error', res)
	})
	const hookPage = page =>{
		page.fetchSite = {}
		const res = responseHook(page)
		page.on('response', res)
		whenClose(page).then(()=>{
			page.off('response', res)
		})
		const inject = function(){
			delete navigator.__proto__.webdriver
			window.addEventListener('message', async ({data, ports, target})=>{
				const port = ports && ports[0]
				target = port || target
				if (data) {
					const {type} = data
					if(type === 'pptrBinding') {
						const payload = await window[data.method](data.params)
						if(target instanceof Worker || target instanceof MessagePort) {
							target.postMessage(payload)
						} else if(target) {
							target.postMessage(payload, '*')
						}
					}
				}
				port && port.close()
			})
		}
		page.evaluate(inject)
		page.evaluateOnNewDocument(inject)
    page.exposeFunction('__pptr__fileUrlExist', async e => {
      const {url} = e
      const pathArray = urlToPath(url, indexFile)
      if(!pathArray) {
        return
      }
      const filePath = joinPath(dir, ...pathArray)
      try{
        let stat = fs.lstatSync(filePath)
        return stat
      }catch(e){
        // console.log(e)
      }
    })
	}
	hookPage(page)
	page.isRoot = true

	browser.on('targetcreated', async target => {
		if (target.type() === 'page') {
      if (/^https?:\/\//i.test(target.url())) {
				console.log('new tab created:', target.url())
				let page
        try {
          page = await target.page()
					hookPage(page)
					page.setCacheEnabled(false)
					// 'response' only applied to resource
					const isLoaded = await page.evaluate(()=>{
						return document.readyState != 'loading'
					})
					const run = async()=>{
						const url = page.url()
						const request = {
							method: 'GET',
							headers: {},
							postData: {},
							resourceType: 'document',
							// redirects: req.redirectChain().map(v=>v.url())
						}
						// const reqUrl = req.url()
						// if(reqUrl != url) request.url = reqUrl
						const data = {
							url,
							file: '',  // optimize v8 hidden class
							status: 200,
							ok: true,
							headers: {},
							request
						}
						await writeData({
							page,
							data,
							url,
							getBuffer: ()=>{
								return page.content()
							}
						})
					}
					if(isLoaded){
						run()
					} else {
						page.on('domcontentloaded', run)
					}
        } catch (e) {
          console.log(e.message)
          if (/Target closed/i.test(e.message)) {
            return
          }
          if (/No target with given id found/i.test(e.message)) {
            return
          }
        }
			}
		}
	})

  // goto url
  if(userAgent) page.setUserAgent(userAgent)
  if(viewport) page.setViewport(viewport)
  if(timeout != null) page.setDefaultNavigationTimeout(timeout)
  if(cookies) page.setCookie(...cookies)
	onBeforeOpen && await onBeforeOpen(page)
	try{
		await page.goto(url, openOption)
	}catch(e){
		console.log(e.message)
	}
  // wait finish
  const pending = []
  onAfterOpen && pending.push(onAfterOpen(page))
  if(waitFor){
    pending.push(waitFor===true ? whenClose(page) : page.waitFor(waitFor))
	}

	const whenEnd = async ()=>{
		const filename = `response-${Date.now()}.json`
		await writeFile(joinPath(dir, filename), JSON.stringify(responseData), 'utf8')
		console.log(`wrote ${filename}`)
		// screen shot
		if(shot){
			if(shot===true) shot = 'screenshot.png'
			const opt = typeof shot==='object'
			? shot
			: {
				path: joinPath(dir, shot),
				fullPage: true
			}
			try{
				// ensure page not closed
				await page.screenshot(opt)
			}catch(e){}
		}

		// finish work
		let alive = browser && !(browser).disconnected
		if(alive){
			try {
				await browser.close()
			} catch(e){}
		}
		onFinish && await onFinish(page)

		return {
			dir,
			url,
			data: responseData
		}
	}

	let closePromiseRes
	const closePromise = new Promise((res)=>closePromiseRes = res)
	async function checkClosed () {
		let alive = browser && !(browser).disconnected
		if (alive) {
			// browser.disconnect()
			await browser.close()
			browser = null
			console.log('browser closed')
		}
		closePromiseRes()
	}

	browser.on('disconnected', e => {
    browser.removeAllListeners()
    browser.disconnected = true
  })

	process.on('beforeExit', () => checkClosed())
  process.on('SIGTERM', () => checkClosed())
  process.on('SIGINT', () => checkClosed())

  await Promise.race([
    Promise.all(pending),
		whenClose(page),
		closePromise
  ])

	return whenEnd()
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

function urlToPath(url, indexFile) {
  let urlObj = {}
		try{
			urlObj = new URL(url)
		} catch(e){
			// TypeError [ERR_INVALID_URL]: Invalid URL: ":"
			return
		}
    const {pathname, protocol, host} = urlObj
    const pathArr = [
      hostDir(protocol, ''),
      hostDir(host),
    ].concat(
      /^blob/.test(protocol)  // url as a whole
        ? safePath(pathname)
        : ensureIndex(pathname, indexFile).split('/').map(safePath)
    )
  return pathArr
}

function toNodeEncoding(enc){
  return enc && typeof enc==='string'
    ? enc.toLowerCase().replace('-', '')
    : 'utf8'
}

module.exports = main
