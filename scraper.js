const puppeteer = require("puppeteer");
const port = process.env.ANYPROXY_PORT || 8001;

async function scraper() {
  const browser = await puppeteer.launch({
    headless: false,
    args: [`--proxy-server=127.0.0.1:${port}`, "--no-sandbox"]
  });

  const page = await browser.newPage();
  await page.goto("https://httpbin.org/ip", {
    waitUntil: "networkidle0",
    timeout: 120000
  });
  const content = await page.$eval("body", e => e.innerText);

  console.log(content);

  if(process.env.SAVE_SCREENSHOT){
    await page.screenshot({ path: "screenshots/screenshot.png", fullPage: true });
  }

  await browser.close();
}

module.exports = scraper;
