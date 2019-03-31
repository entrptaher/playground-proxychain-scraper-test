const spawnProxy = require("./spawn-proxy");
const scraper = require("./scraper");

spawnProxy().then(async proxy=>{
  await scraper();
  await proxy.kill();
});
