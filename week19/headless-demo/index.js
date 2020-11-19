const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://www.baidu.com/')
    // await page.screenshot({ path: 'example.png' })
    // const a = await page.$('a')
    const imgs = await page.$$('a')
    // console.log(a)
    console.log(imgs)

    // await browser.close()
})()