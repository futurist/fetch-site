const main = require('../')
const {readFileSync, writeFileSync} = require('fs')
const {promisify} = require('util')
const dirCompare = require('dir-compare')
const {exec} = require('child_process')
const sortOn = require('sort-on')

const run = promisify(exec)
const timeout = 30 * 1e3
const fixtures = __dirname + '/fixtures'
const launchOption = {
  args: ['--no-sandbox'],
}
function folderIsDiff(a,b, {noblob=true}={}){
  // makeChangeForTest(a)
  // makeChangeForTest(b)
  let excludeFilter = 'response.json,shot.png'
  if(noblob) excludeFilter+=',blob'
  return dirCompare.compare(a,b,{
    compareContent: true,
    excludeFilter
    // TODO: check isEqual these json/png files
    // CI will fail for screenshot.png since font-different, etc.
  }).then(result=>{
    for(let obj of result.diffSet){
      if(obj.state!='equal') return obj
    }
  })
}

function responseIsSame(responseFilePath) {
  const res = require(responseFilePath)
  res.forEach(v=>{delete v.headers['last-modified']; delete v.headers.date})
  expect(res).toMatchSnapshot()
}

function makeChangeForTest(folder){
  const file = folder+'/response.json'
  let newResponse = JSON.parse(readFileSync(file,'utf8'))
  newResponse = sortOn(newResponse, ['file', 'headers.date'])
  newResponse.map(v=>{
    v.headers['date'] = null
    v.headers['x-devtools-emulate-network-conditions-client-id'] = null
    v.request.headers['x-devtools-emulate-network-conditions-client-id'] = null
  })
  writeFileSync(file, JSON.stringify(newResponse), 'utf8')
}

function setupServer(done){
  const express = require('express')
  const throttle = require('express-throttle-bandwidth')
  const app = express()
  let count = 0
  app.use(throttle(90e3)) // ~10kb/s
  app.get('/', (req,res)=>res.redirect('index.html'))
  app.get('/count', (req,res)=>res.end(++count+''))
  app.use(express.static(fixtures+'/www'))
  return app.listen(18181, done)
}
// var fixtures=__dirname + '/fixtures'; setupServer()

beforeEach(done=>{
  this.folder = fixtures+'/tmp/'+ +new Date
  this.server = setupServer(done)
})

afterEach( done=>{
  const {server, folder} = this
  server && server.close()
  // exec(`rm -rf ${folder}`, done)
  done()
})


describe('local site test', ()=>{
  test('should throw', async ()=>{
    expect.assertions(3)
    try{
      await main()
    }catch(e){
      expect(e).toBeTruthy()
    }

    try{
      await main({
        dir: 'tmp/local',
      })
    }catch(e){
      expect(e).toBeTruthy()
    }

    await main({
      url: 'http://localhost:18181',
      launchOption
    })
    await run(`rm -rf localhost_18181`)
    expect(1).toBeTruthy()
  }, timeout)


  test('onload', async ()=>{
    await main({
      dir: this.folder,
      url: 'localhost:18181',
      launchOption,
      openOption: {
        waitUntil:'domcontentloaded'
      },
      onFinish: page=>{
        page.removeListener('response', page.fetchSite.responseHook)
      }
    })

    expect(
      await folderIsDiff(this.folder, fixtures+'/local-onload')
    ).toBeFalsy()

    responseIsSame(fixtures+'/local-onload/response.json')

  }, timeout)

  test('networkidle2', async ()=>{
    await main({
      dir: this.folder,
      url: 'localhost:18181',
      launchOption,
      openOption: {
        waitUntil:'networkidle2'
      }
    })

    expect(
      await folderIsDiff(this.folder, fixtures+'/local-networkidle2')
    ).toBeFalsy()

    responseIsSame(fixtures+'/local-networkidle2/response.json')

  }, timeout)

  test('event hooks', async ()=>{
    await main({
      dir: this.folder,
      url: 'localhost:18181',
      launchOption,
      shot: 'shot.png',
      openOption: {
        waitUntil:'networkidle2'
      },
      onResponse: res=>{
        if(res.url.indexOf('dot')>-1) return false
        if(/^blob/.test(res.url)){
          res.url = 'blob:blob-url'
        }
      },
      onBeforeOpen: async page=>{
        page.setViewport({width: 1440, height: 1000})
      },
      onAfterOpen: async page=>{
        await new Promise(r=>setTimeout(r, 100))
      },
      onFinish: async page=>expect(page).toBeTruthy()
    })

    expect(
      await folderIsDiff(this.folder, fixtures+'/local-events', {noblob:false})
    ).toBeFalsy()

    responseIsSame(fixtures+'/local-events/response.json')

  }, timeout)

})

