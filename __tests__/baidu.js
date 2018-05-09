const main = require('../')

test('should work without throw', async ()=>{
  // EX=External Site
  if(!process.env.ES) return
  await main({
    url: 'http://www.baidu.com',
    shot: 'shot.png',
    dir: 'baidu.com',
    launchOption:{
      // headless: false
    },
    openOption:{
      timeout: 100*1e3,
      waitUntil: 'networkidle0'
    },
    onResponse: response=>{
      if(/his/.test(response.url)) return false
    },
    onBeforeOpen: async page=>{
      page.setViewport({width: 1440, height: 1000})
    },
    onAfterOpen: async page=>{
      await new Promise(r=>setTimeout(r, 100))
    },
    onFinish: async page=>expect(page).toBeTruthy()
  })
}, 30*1e3)
