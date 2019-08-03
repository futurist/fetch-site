#!/usr/bin/env node

const {URL} = require('url')
const evalExpression = require('eval-expression')
const main = require('./')
const pkg = require('./package.json')
const cli = require('meow')(`
Usage
$ ${pkg.name} url [options]

Options
--version           Show version info
--help              Show help info
--no-headless, -h   Set {headless: false} for 'launch-option', default true
--dir, -d           Dir to save result to
--shot, -s          Filename to save a screenshot after page open
--user-agent, -u    Set userAgent, string
--viewport, -v      Set viewport, , e.g. '{width:1024, height: 768}'
--timeout, -t       Set maximum navigation time in milliseconds
--cookies, -c       Set cookies
--wait-for, -w      Wait for milliseconds/selector/function/closed, default true
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
    dir: {alias: 'd'},
    shot: {alias: 's'},
    'wait-for': {alias: 'w', default: true},
    'user-agent': {alias: 'u'},
    'viewport': {alias: 'v'},
    'timeout': {alias: 't'},
    'cookies': {alias: 'c'},
    'no-headless': {type: 'boolean', alias: 'h', default: true},
    'open-option': {alias: 'o'},
    'launch-option': {alias: 'l'},
  }
})

const {flags, input} = cli
const [url] = input||[]

if(!url) cli.showHelp()
else flags.url = url

;[
  'launchOption',
  'openOption',
  'onBeforeOpen',
  'onAfterOpen',
  'onFinish',
  'onResponse',
  'waitFor',
  'cookies',
].forEach(v=>flags[v] = evalExpression(flags[v]))

flags.launchOption = Object.assign({
	headless: !flags.noHeadless,
	defaultViewport: null
}, flags.launchOption)

;(async ()=>{
  const {dir, url, data} = await main(flags)
  console.log(`\nSuccess: site ${url} saved into ${dir}`)
})()

