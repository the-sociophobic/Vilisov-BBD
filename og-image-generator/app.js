const express = require('express')
const crypto = require('crypto')
const os = require('os')
const fs = require('fs')
const util = require('util')

const chrome = require('chrome-aws-lambda')
// const puppeteer = require('puppeteer-core')
const { get } = require('http')

const React = require('react')
const htmlToImage = require('html-to-image')

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
// const chromePathUbuntu = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const app = express()
const port = 3000

const promiseWriteFile = util.promisify(fs.writeFile)


const writeFile2 = async (fileName, html) => {
  // const hashedFileName = crypto.createHash("md5")
  //   .update(fileName)
  //   .digest("hex") + ".html"

  // const filePath = os.tmpdir() + hashedFileName
  const filePath = "/Users/lev/Downloads/test/" + fileName
  
  htmlToImage.toPng(html.getElementById("og-image"))
    .then(async dataUrl => await promiseWriteFile(filePath, dataUrl))
  

  return `file://${filePath}`
}



getOptions = async isDev => {
  let options

  if (isDev)
    options = {
      args: [],
      executiblePath: chromePath,
      headless: true,
    }
  else
    options = {
      args: chrome.args,
      executiblePath: await chrome.executiblePath,
      headless: chrome.headless,
    }

  return options
}

const getScreenshot = async (url, isDev) => {
  // const browser = await puppeteer.launch(await getOptions(isDev))
  // const browser = await puppeteer.launch()
  // const page = await browser.newPage()

  await page.setViewport({
    width: 1200,
    height: 630,
  })

  await page.goto(url)

  return page.screenshot({type: "png", quality: 100})
}



app.get('/*', async (req, res) => {
  const page = 
    <div id="og-image" style="width: 1200px; height: 630px">
      <img
        style="width: 1200px; height: 630px"
        src="https://sun9-53.userapi.com/c855032/v855032066/234251/DKU1YJ9UibI.jpg"
      ></img>
      <div text=""></div>
    </div>

  const fileUrl = await writeFile2("a",
  )
  const file = await getScreenshot(fileUrl, true)
  console.log(file)

  res.send('Hello World!')
})




app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))