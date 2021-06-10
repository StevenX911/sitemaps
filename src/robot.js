const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const request = require('request')
const xmlreader = require('xmlreader')

const startURI = 'https://www.sitemaps.org/'
const siteMap = 'https://www.sitemaps.org/sitemap.xml'
const dirPrefix = '../temp/'
const clog = console.log

request(siteMap, function(errors, response, body) {
  clog(`${siteMap} ${chalk.green('GET')}`)
  if(errors) throw new Error('请求出错')
  // clog(response)
  xmlreader.read(body, function(errors, response) {
    if(errors) throw new Error('解析出错')
    // clog(response.urlset)
    clog(response.urlset.url.array)
  })
})
