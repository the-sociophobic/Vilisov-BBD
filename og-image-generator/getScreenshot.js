const chrome = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'


getOptions = async isDev => {
  let options

  if (isDev)
    options = {
      args: [],
      executablePath: chromePath,
      headless: true,
    }
  else
    options = {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    }

  return options
}

const getScreenshot = async (url, isDev) => {
  const options = await getOptions(isDev)
  const browser = await puppeteer.launch(options)
  const page = await browser.newPage()

  await page.setViewport({
    width: 1200,
    height: 630,
  })
  await page.goto(url)

  return page.screenshot({type: "png"})
}

module.exports = { getScreenshot }
