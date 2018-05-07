#!/usr/bin/env node

const evalExpression = require('eval-expression')
const main = require('./')
const pkg = require('./package.json')
const cli = require('meow')(`
Usage
$ ${pkg.name} [options]

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
$ ${pkg.name} -u http://baidu.com -d baidu -o '{waitUntil:"networkidle0"}'
`, {
  flags:{
    help: {alias: 'h'},
    version: {alias: 'v'},
    dir: {alias: 'd'},
    url: {alias: 'u'},
    shot: {alias: 's'},
    'open-option': {alias: 'o'},
  }
})

const {flags} = cli

;[
  'launchOption',
  'openOption',
  'onBeforeOpen',
  'onAfterOpen',
  'onFinish',
  'filter'
].forEach(v=>flags[v] = evalExpression(flags[v]))

main(flags).then(()=>{
  console.log(`\nSuccess: site ${flags.u} saved into ${flags.d}`)
})



