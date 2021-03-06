const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const { parse } = require('node-html-parser')
const clog = console.log

const ga = `<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-1JP3LJKRSJ"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-1JP3LJKRSJ');
</script>`

const list = []

function listFileSync (dir) {
  const arr = fs.readdirSync(dir)
  arr.forEach(function (item) {
    const fullpath = path.join(dir, item)
    const stats = fs.statSync(fullpath)
    if (stats.isDirectory()) {
      listFileSync(fullpath)
    } else {
      list.push(fullpath)
    }
  })
  return list
}

const run = async () => {
  try {
    const list = listFileSync(path.resolve(__dirname, '../temp'))
    for (const htmlpath of list) {
      clog(chalk.green('清洗'), htmlpath)
      const parsed = path.parse(htmlpath)
      if (fs.existsSync(htmlpath) && parsed.ext === '.html') {
        let htmlcontent = fs.readFileSync(htmlpath, 'utf8')
        // htmlcontent = htmlcontent.replace(/http:\/\/www.sitemaps.org\//g, 'https://www.sitemaps.org.cn/')
        htmlcontent = htmlcontent.replace(/faq.php/g, 'faq.html')
        htmlcontent = htmlcontent.replace(/protocol.php/g, 'protocol.html')
        htmlcontent = htmlcontent.replace(/index.php/g, 'index.html')
        htmlcontent = htmlcontent.replace(/terms.php/g, 'terms.html')
        const root = parse(htmlcontent)
        const scripts = root.querySelectorAll('script')
        scripts.forEach(v => {
          if (
            v.rawAttrs.indexOf('src') < 0 ||
            v.rawAttrs.indexOf('googletagmanager') > -1
          ) {
            // remove page ad
            v.remove()
          }
        })

        const body = root.querySelector('body')
        const gascript = parse(ga)
        if (body) {
          body.appendChild(gascript)
        } else {
          const html = root.querySelector('html')
          html.appendChild(gascript)
        }

        fs.writeFileSync(htmlpath, root)
      }
    }

    const cnProtocolPath = path.resolve(
      __dirname,
      '../temp/zh_CN/protocol.html'
    )
    const twProtoalPath = path.resolve(__dirname, '../temp/zh_TW/protocol.html')
    if (fs.existsSync(cnProtocolPath) && fs.existsSync(twProtoalPath)) {
      fs.copyFileSync(twProtoalPath, cnProtocolPath)
      clog(chalk.green('覆写zh_CN'))
    }

    clog(chalk.green('清洗完毕'))
  } catch (err) {
    clog(chalk.red('清洗失败'), err)
  }
}

if (typeof describe === 'undefined') {
  run()
}

module.exports = {
  listFileSync,
  run
}
