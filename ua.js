// updated from https://techblog.willshouse.com/2012/01/03/most-common-user-agents/
// Date: Mon Aug 05 2019 22:43:18 GMT+0800 (GMT+08:00)

const UAList = [
  {
    percent: '13.8%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
    system: 'Chrome 74.0 Win10'
  },
  {
    percent: '9.9%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
    system: 'Chrome 75.0 Win10'
  },
  {
    percent: '7.4%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
    system: 'Chrome 75.0 Win10'
  },
  {
    percent: '4.5%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:68.0) Gecko/20100101 Firefox/68.0',
    system: 'Firefox 68.0 Win10'
	},
	{
		percent: '2.7%',
		useragent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
		system: 'Chrome 76.0 macOS'
	},
  {
    percent: '2.7%',
    useragent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
    system: 'Chrome 75.0 macOS'
  },
  {
    percent: '2.6%',
    useragent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15',
    system: 'Safari 12.1 macOS'
  },
  {
    percent: '2.2%',
    useragent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
    system: 'Chrome 75.0 macOS'
  },
  {
    percent: '2.1%',
    useragent:
      'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
    system: 'Chrome 75.0 Win7'
  },
  {
    percent: '2.0%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0',
    system: 'Firefox 67.0 Win10'
  },
  {
    percent: '1.4%',
    useragent:
      'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
    system: 'Chrome 75.0 Win7'
  },
  {
    percent: '1.2%',
    useragent:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
    system: 'Chrome 75.0 Linux'
  },
  {
    percent: '1.2%',
    useragent:
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0',
    system: 'Firefox 68.0 Linux'
  },
  {
    percent: '1.1%',
    useragent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:68.0) Gecko/20100101 Firefox/68.0',
    system: 'Firefox 68.0 macOS'
  },
  {
    percent: '0.9%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134',
    system: 'Edge 17.0 Win10'
  },
  {
    percent: '0.9%',
    useragent:
      'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:68.0) Gecko/20100101 Firefox/68.0',
    system: 'Firefox 68.0 Win7'
  },
  {
    percent: '0.9%',
    useragent:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
    system: 'Chrome 75.0 Linux'
  },
  {
    percent: '0.8%',
    useragent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
    system: 'Chrome 75.0 macOS'
  },
  {
    percent: '0.8%',
    useragent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
    system: 'Chrome 75.0 macOS'
  },
  {
    percent: '0.8%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; rv:68.0) Gecko/20100101 Firefox/68.0',
    system: 'Firefox 68.0 Win10'
  },
  {
    percent: '0.8%',
    useragent: 'User_Agent',
    system: 'General Crawlers unknown'
  },
  {
    percent: '0.7%',
    useragent:
      'Mozilla/5.0 (X11; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0',
    system: 'Firefox 68.0 Linux'
  },
  {
    percent: '0.6%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.17763',
    system: 'Edge 18.0 Win10'
  },
  {
    percent: '0.6%',
    useragent:
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:67.0) Gecko/20100101 Firefox/67.0',
    system: 'Firefox 67.0 Linux'
  },
  {
    percent: '0.6%',
    useragent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
    system: 'Chrome 75.0 macOS'
  },
  {
    percent: '0.6%',
    useragent:
      'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0',
    system: 'Firefox 60.0 Linux'
  },
  {
    percent: '0.6%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36',
    system: 'Chrome 76.0 Win10'
  },
  {
    percent: '0.6%',
    useragent:
      'Mozilla/5.0 (Windows NT 6.1; rv:60.0) Gecko/20100101 Firefox/60.0',
    system: 'Firefox 60.0 Win7'
  },
  {
    percent: '0.5%',
    useragent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:67.0) Gecko/20100101 Firefox/67.0',
    system: 'Firefox 67.0 macOS'
  },
  {
    percent: '0.5%',
    useragent:
      'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0',
    system: 'Firefox 67.0 Win7'
  },
  {
    percent: '0.5%',
    useragent:
      'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
    system: 'IE 11.0 for Desktop Win7'
  },
  {
    percent: '0.5%',
    useragent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Safari/605.1.15',
    system: 'Safari 12.1 macOS'
  },
  {
    percent: '0.5%',
    useragent:
      'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
    system: 'Chrome 75.0 Win8.1'
  },
  {
    percent: '0.4%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
    system: 'Chrome 62.0 Win10'
  },
  {
    percent: '0.4%',
    useragent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15',
    system: 'Safari 12.1 macOS'
  },
  {
    percent: '0.4%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18362',
    system: 'Edge 18.0 Win10'
  },
  {
    percent: '0.4%',
    useragent:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
    system: 'Chrome 72.0 Linux'
  },
  {
    percent: '0.4%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
    system: 'Chrome 75.0 Win10'
  },
  {
    percent: '0.4%',
    useragent:
      'Mozilla/5.0 (iPad; CPU OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Mobile/15E148 Safari/604.1',
    system: 'Mobile Safari 12.1 iOS'
  },
  {
    percent: '0.3%',
    useragent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Safari/605.1.15',
    system: 'Safari 12.1 macOS'
  },
  {
    percent: '0.3%',
    useragent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
    system: 'Chrome 75.0 macOS'
  },
  {
    percent: '0.3%',
    useragent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/605.1.15',
    system: 'Safari Generic MacOSX'
  },
  {
    percent: '0.3%',
    useragent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
    system: 'Chrome 75.0 macOS'
  },
  {
    percent: '0.3%',
    useragent:
      'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
    system: 'Chrome 75.0 Win8.1'
  },
  {
    percent: '0.3%',
    useragent:
      'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:68.0) Gecko/20100101 Firefox/68.0',
    system: 'Firefox 68.0 Win8.1'
  },
  {
    percent: '0.3%',
    useragent:
      'Mozilla/5.0 (X11; Linux x86_64; rv:67.0) Gecko/20100101 Firefox/67.0',
    system: 'Firefox 67.0 Linux'
  },
  {
    percent: '0.3%',
    useragent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
    system: 'Chrome 75.0 macOS'
  },
  {
    percent: '0.3%',
    useragent:
      'Mozilla/5.0 (Linux; U; Android 4.3; en-us; SM-N900T Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
    system: 'Android Browser 4.0 Android'
  },
  {
    percent: '0.3%',
    useragent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
    system: 'Chrome 75.0 macOS'
  },
  {
    percent: '0.3%',
    useragent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
    system: 'Chrome 75.0 macOS'
  },
  {
    percent: '0.3%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
    system: 'IE 11.0 for Desktop Win10'
  },
  {
    percent: '0.3%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36 OPR/62.0.3331.72',
    system: 'Opera Generic Win10'
  },
  {
    percent: '0.3%',
    useragent:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36',
    system: 'Chrome 76.0 Linux'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
    system: 'Chrome 75.0 macOS'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36',
    system: 'Chrome 75.0 Win10'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:69.0) Gecko/20100101 Firefox/69.0',
    system: 'Firefox Generic Win10'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
    system: 'Chrome 73.0 Win7'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36',
    system: 'Chrome 70.0 Linux'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/75.0.3770.90 Chrome/75.0.3770.90 Safari/537.36',
    system: 'Chromium 75.0 Linux'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:66.0) Gecko/20100101 Firefox/66.0',
    system: 'Firefox 66.0 Linux'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
    system: 'Chrome 72.0 Win10'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 YaBrowser/19.6.2.599 Yowser/2.5 Safari/537.36',
    system: 'Yandex Browser Generic Win10'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
    system: 'Chrome 75.0 Win7'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15',
    system: 'Safari 12.1 macOS'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.3 Safari/605.1.15',
    system: 'Safari 12.0 macOS'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
    system: 'Chrome 74.0 macOS'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36',
    system: 'Chrome 74.0 Win10'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15',
    system: 'Safari 11.1 MacOSX'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
    system: 'Chrome 73.0 Win10'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:60.0) Gecko/20100101 Firefox/60.0',
    system: 'Firefox 60.0 Win10'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
    system: 'Chrome 75.0 MacOSX'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0',
    system: 'Firefox 66.0 Win10'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:68.0) Gecko/20100101 Firefox/68.0',
    system: 'Firefox 68.0 Win10'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
    system: 'Chrome 75.0 Win7'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
    system: 'Chrome 74.0 Linux'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:68.0) Gecko/20100101 Firefox/68.0',
    system: 'Firefox 68.0 macOS'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
    system: 'Chrome 75.0 Win10'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:45.0) Gecko/20100101 Firefox/45.0',
    system: 'Firefox 45.0 Win10'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:55.0) Gecko/20100101 Firefox/55.0',
    system: 'Firefox 55.0 Win7'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 YaBrowser/19.6.3.185 Yowser/2.5 Safari/537.36',
    system: 'Yandex Browser Generic Win7'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
    system: 'Chrome 75.0 Win7'
  },
  {
    percent: '0.2%',
    useragent:
      'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
    system: 'Chrome 75.0 Win7'
  }
]

const os = require('os')
const windowsRelease = require('windows-release')

function getUA (keyword = '', precise = false) {
  const re1 = new RegExp(keyword + '.*' + getOS() + '$', 'i')
  const re2 = new RegExp(keyword, 'i')
  return precise
    ? UAList.find(x => x.system === keyword)
    : UAList.find(
	  x => re1.test(x.system) || re1.test(x.system.replace(/\s+/g, '')) ||
	  keyword && (re2.test(x.system) || re2.test(x.system.replace(/\s+/g, '')))
    )
}
// console.log(getUA(undefined))

function getOS(platform = os.platform(), release = os.release()) {
	let os = 'unknown'
	switch(platform){
		case 'android':
			break
		case 'cygwin':
		case 'win32':{
			let ver = windowsRelease(release) || ''
			os = 'Win' + ver
			break
		}
		case 'darwin':
			os = 'macOS'
			break
		default:
			os = 'Linux'
	}
	return os
}

module.exports = {
  UAList,
  getUA,
  getOS
}

