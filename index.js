const spawnProxy = require("./spawn");
const scraper = require("./scraper");

spawnProxy().then(async proxy=>{
  await scraper();
  await proxy.kill();
});
