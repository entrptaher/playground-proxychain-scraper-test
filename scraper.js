const puppeteer = require("puppeteer");

async function scraper() {
  const browser = await puppeteer.launch({
    args: ["--proxy-server=127.0.0.1:8001"]
  });
  const page = await browser.newPage();
  await page.goto("https://httpbin.org/ip");
  const content = await page.$eval("body", e => e.innerText);

  console.log(content);

  await browser.close();
}

module.exports = scraper;
