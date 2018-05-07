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

**CLI**

```sh
$ fetch-site [options]

Options
--version, -v      Show version info
--help, -h         Show help info
--dir, -d          Dir to save result to
--url, -u          Url to fetch
--shot, -s         Filename to save a screenshot after page open
--index-file       Default name of index file, like index.html
--filter           Filter for response item, function as string
--launch-option    Launch option passed into puppeteer, object as string
--open-option, -o  Open option to passed into page, object as string
--on-before-open   Before open page event, function as string
--on-after-open    After open page event, function as string
--on-finish        Finish fetch event, function as string

Examples
$ fetch-site -u http://baidu.com -d baidu -o '{waitUntil:"networkidle0"}'
```

**Module**

```js
main({
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
  // filter: return false will skip the resource
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
```

Then check the folder `baidu.com` for results.

