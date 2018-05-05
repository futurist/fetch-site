const main = require('../')
const {readFileSync, writeFileSync} = require('fs')
const {promisify} = require('util')
const dirCompare = require('dir-compare')
const {exec} = require('child_process')

const timeout = 30 * 1e3
const fixtures = __dirname + '/fixtures'
function folderIsDiff(a,b){
  return dirCompare.compare(a,b,{
    compareContent: true,
    excludeFilter: 'response.json'
  }).then(result=>{
    for(let obj of result.diffSet){
      if(obj.state!='equal') return obj
    }
  })
}

let testCount = 0
beforeEach(done=>{
  const express = require('express')
  const app = express()
  let count = 0
  app.use(express.static(fixtures+'/www'))
  app.get('/count', (req,res)=>res.end(++count+''))
  this.server = app.listen(18181, done)
  this.folder = fixtures+'/tmp/'+ +new Date
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

    try{
      await main({
        url: 'http://localhost:18181',
      })
    }catch(e){
      expect(e).toBeTruthy()
    }

  }, timeout)


  test('should not throw', async ()=>{

    await main({
      dir: this.folder,
      url: 'http://localhost:18181',
    })

    expect(
      await folderIsDiff(this.folder, fixtures+'/local-onload')
    ).toBeFalsy()

    await main({
      dir: this.folder,
      url: 'http://localhost:18181',
      openOption: {
        waitUntil:'networkidle0'
      }
    })

    expect(
      await folderIsDiff(this.folder, fixtures+'/local-networkidle0')
    ).toBeFalsy()

  }, timeout)
})

