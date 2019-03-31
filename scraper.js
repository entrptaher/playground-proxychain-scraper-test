const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    args: [
      "--proxy-server=127.0.0.1:8001"
    ]
  });
  const page = await browser.newPage();
  await page.goto("https://httpbin.org/ip");
  await page.screenshot({ path: "httpbin.png" });

  await browser.close();
})();
