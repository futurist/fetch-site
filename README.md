# fetch-site
Fetch website with all the resources/responses/requests to local files, using [puppeteer](https://github.com/GoogleChrome/puppeteer/).

## Install

```sh
npm install -S fetch-site
```

## Usage

```js
main({
  url: 'http://www.baidu.com',
  shot: 'shot.png',
  dir: 'baidu.com',
  includeRequest: true,
  openOption:{
    timeout: 100*1e3,
    waitUntil: 'networkidle0'
  },
  onFinish: e=>console.log('ok')
})
```

Then check the folder `baidu.com` for results.

