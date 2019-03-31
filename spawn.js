var spawn = require("child_process").spawn;
var which = require("npm-which")(process.cwd());
var anyproxyPath = which.sync("anyproxy");
const fs = require("fs");
require("dotenv").config();

async function writeConfig() {
  const pre = `random_chain
  quiet_mode
  proxy_dns
  tcp_read_time_out 15000
  tcp_connect_time_out 8000
  
  [ProxyList]
  `;

  const proxies = Object.entries(process.env)
    .filter(([key]) => key.includes("PROXY"))
    .map(([key, value]) => value)
    .join("\n");

  await fs.writeFileSync("custom.conf", pre + proxies);
}

async function runProxy() {
  var child = spawn("proxychains4", ["-f", "custom.conf", anyproxyPath]);

  child.stdout.on("data", function(data) {
    console.log("stdout: " + data);
    //Here is where the output goes
  });

  child.stderr.on("data", function(data) {
    console.log("stderr: " + data);
    //Here is where the error output goes
  });

  child.on("close", function(code) {
    console.log("closing code: " + code);
    //Here you can get the exit code of the script
  });

  /**
   * Child process cleaner
   * https://stackoverflow.com/a/14032965/6161265
   */

  process.stdin.resume(); //so the program will not close instantly

  function exitHandler(options, exitCode) {
    child.kill();
    if (options.cleanup) console.log("clean");
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
  }

  //do something when app is closing
  process.on("exit", exitHandler.bind(null, { cleanup: true }));

  //catches ctrl+c event
  process.on("SIGINT", exitHandler.bind(null, { exit: true }));

  // catches "kill pid" (for example: nodemon restart)
  process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
  process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));

  //catches uncaught exceptions
  process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
}

(async () => {
  await writeConfig();
  await runProxy();
})();
