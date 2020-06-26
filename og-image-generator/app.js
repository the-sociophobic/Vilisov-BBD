const express = require('express')
const crypto = require('crypto')
const os = require('os')
const fs = require('fs')
const util = require('util')

const { get } = require('http')

const htmlToImage = require('html-to-image')
const afterLoad = require('after-load')

const { getScreenshot } = require('./getScreenshot')


const app = express()
const port = 3030

const promiseWriteFile = util.promisify(fs.writeFile)


const writeFile2 = async (fileName, html) => {
  // const hashedFileName = crypto.createHash("md5")
  //   .update(fileName)
  //   .digest("hex") + ".html"

  // const filePath = os.tmpdir() + hashedFileName
  const filePath = "/Users/lev/Downloads/test/" + fileName
  
  // htmlToImage.toPng(html.getElementById("og-image"))
  //   .then(async dataUrl => await promiseWriteFile(filePath, dataUrl))
  await promiseWriteFile(filePath, html)

  return `file://${filePath}`
}


app.get('/*', async (req, res) => {

  for (let i = 555; i <= 556; i++) {
    afterLoad(`http://localhost:3000/?amount=${i}`, async html => {
      const fixedHtml = html.replace(/src=\"\//gi, `src="http://localhost:3000/`)
      // console.log(fixedHtml)
      // console.log(fixedHtml)
      const fileLocalUrl = await writeFile2(i + ".html", fixedHtml)
      const image = await getScreenshot(fileLocalUrl, true)
      await writeFile2(i + ".png", image)
    })
  }

  res.send('Hello World!')
})




app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))