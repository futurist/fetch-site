# fetch-site
Fetch website with all the resources/responses/requests to local files, using [puppeteer](https://github.com/GoogleChrome/puppeteer/).

[![npm](https://img.shields.io/npm/v/fetch-site.svg "Version")](https://www.npmjs.com/package/fetch-site)
[![Build Status](https://travis-ci.org/futurist/fetch-site.svg?branch=master)](https://travis-ci.org/futurist/fetch-site)


## Install

**CLI**

```sh
npm install -g fetch-site
```

**Module**
```sh
npm install --save fetch-site
```

## Usage

**CLI Usage**

```sh
$ fetch-site url [options]

Options
--version           Show version info
--help              Show help info
--no-headless, -h   Set {headless: false} for launch-option
--dir, -d           Dir to save result to
--shot, -s          Filename to save a screenshot after page open
--wait-for, -w      Wait for milliseconds/selector/function/closed(true)
--index-file        Default name of index file, like index.html
--on-response       onResponse event, function(response) as string
--launch-option, -l Launch option passed into puppeteer, object as string
--open-option, -o   Open option to passed into page, object as string
--on-before-open    Before open page event, function(page) as string
--on-after-open     After open page event, function(page) as string
--on-finish         Finish fetch event, function(page) as string

Examples
$ fetch-site http://baidu.com -h -w -o '{waitUntil:"networkidle0"}'
```

Above example will open the url with `{headless:false}`, wait until `networkidle0`, and wait for page close to exit.

**Module Usage**

```js
const fetchSite = require('fetch-site')
fetchSite({
  url: 'http://www.baidu.com',
  // whether to save a screenshot
  shot: 'shot.png',
  dir: 'baidu.com',
  launchOption:{
    headless: false
  },
  openOption:{
    timeout: 100*1e3,
    waitUntil: 'networkidle0'
  },
  onResponse: async response=>{
    if(/his/.test(response.url)) return false
    // return false will skip the resource
  },
  onBeforeOpen: async page=>{
    page.setViewport({width: 1440, height: 1000})
  },
  onAfterOpen: async page=>{
    await new Promise(r=>setTimeout(r, 5000))
  },
  onFinish: async page=>console.log('ok')
})
```

Then check the folder `baidu.com` for results.

