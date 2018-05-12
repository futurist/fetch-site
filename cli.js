#!/usr/bin/env node

const {URL} = require('url')
const evalExpression = require('eval-expression')
const main = require('./')
const pkg = require('./package.json')
const cli = require('meow')(`
Usage
$ ${pkg.name} url [options]

Options
--version, -v       Show version info
--help, -h          Show help info
--dir, -d           Dir to save result to
--shot, -s          Filename to save a screenshot after page open
--index-file        Default name of index file, like index.html
--on-response       onResponse event, function(response) as string
--launch-option, -l Launch option passed into puppeteer, object as string
--open-option, -o   Open option to passed into page, object as string
--on-before-open    Before open page event, function(page) as string
--on-after-open     After open page event, function(page) as string
--on-finish         Finish fetch event, function(page) as string

Examples
$ ${pkg.name} http://baidu.com -o '{waitUntil:"networkidle0"}'
`, {
  flags:{
    help: {alias: 'h'},
    version: {alias: 'v'},
    dir: {alias: 'd'},
    shot: {alias: 's'},
    'open-option': {alias: 'o'},
    'launch-option': {alias: 'l'},
  }
})

const {flags, input} = cli
const [url] = input||[]

if(!url) cli.showHelp()

;[
  'launchOption',
  'openOption',
  'onBeforeOpen',
  'onAfterOpen',
  'onFinish',
  'onResponse'
].forEach(v=>flags[v] = evalExpression(flags[v]))

(async ()=>{
  const {dir, url, data} = await main(flags)
  console.log(`\nSuccess: site ${url} saved into ${dir}`)
})()

