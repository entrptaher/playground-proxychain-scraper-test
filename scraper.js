const puppeteer = require("puppeteer");
const port = process.env.ANYPROXY_PORT || 8001;

async function scraper() {
  const browser = await puppeteer.launch({
    // args: [`--proxy-server=127.0.0.1:${port}`]
  });

  const page = await browser.newPage();
  await page.goto("https://httpbin.org/ip");
  const content = await page.$eval("body", e => e.innerText);

  console.log(content);

  await browser.close();
}

module.exports = scraper;
