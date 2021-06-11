const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const rpn = require('request-promise-native') // deprecated!
const xmlreader = require('xmlreader')

const startURI = 'https://www.sitemaps.org/'
const siteMap = 'https://www.sitemaps.org/sitemap.xml'
const dirPrefix = '../temp/'
const clog = console.log

function getPageName (uri) {
  if (uri.endsWith('/')) {
    return `${uri}index.html`.replace(`${startURI}`, '')
  } else {
    return uri.replace(`${startURI}`, '')
  }
}

function savePageHTML (uri) {
  const tempPagePath = path.resolve(__dirname, dirPrefix + getPageName(uri))
  if (!fs.existsSync(tempPagePath)) {
    return rpn(uri)
      .then(function (body) {
        clog(`${uri} ${chalk.green('GET')}`)
        fs.ensureFileSync(tempPagePath)
        fs.writeFileSync(tempPagePath, body)
        clog(`${uri} ${chalk.green('下载成功')}`)
      })
      .catch(function (err) {
        clog(chalk.red(`程序异常:${err}`))
      })
  } else {
    return Promise.resolve(clog(`${uri} ${chalk.yellow('跳过')}`))
  }
}

(() => {
  rpn(siteMap)
    .then(function (body) {
      // clog(body)
      xmlreader.read(body, function (errors, response) {
        if (errors) throw new Error('解析出错')
        // clog(response.urlset)
        // clog(response.urlset.url.array)
        const arr = []
        for (const url of response.urlset.url.array) {
          // clog(url.loc.text())
          arr.push(savePageHTML(url.loc.text()))
        }
        Promise.all(arr).then(() => {
          clog(chalk.green('下载完成'))
        })
      })
    })
    .catch(function (err) {
      clog(chalk.red(`程序异常: ${err}`))
    })
})()
