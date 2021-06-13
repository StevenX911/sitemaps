const { getPageName } = require('../src/robot')
const { expect } = require('chai')

describe('robot.js', function () {
  it('getPageName返回index.html', function () {
    expect(
      getPageName('https://www.sitemaps.org/')
    ).equal('index.html')
  })

  it('getPageName返回abc.html', function () {
    expect(
      getPageName(
        'https://www.sitemaps.org/abc.html'
      )
    ).equal('abc.html')
  })
})
