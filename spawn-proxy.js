require("dotenv").config();

const debug = require("debug")("proxy");
const fs = require("fs");
const spawn = require("child_process").spawn;
const which = require("npm-which")(process.cwd());

const anyproxyPath = which.sync("anyproxy");
const ANYPROXY_PORT = process.env.ANYPROXY_PORT || 8001;

async function writeConfig() {
  const pre = fs.readFileSync("./proxy-prefix.conf") + "\n";

  const proxyArr = Object.entries(process.env)
    .filter(([key]) => key.includes("PROXYCHAIN_PROXY"))
    .map(([key, value]) =>
      value
        .trim()
        // remove leading quotes if docker-compose adds them
        .replace(/^"(.*)"$/, "$1")
        .split(/[\n,;]+/gm)
    );

  const proxies = [].concat.apply([], proxyArr).join("\n");

  console.log(proxies);
  await fs.writeFileSync("custom.conf", `${pre}${proxies}`, "utf-8");
  const contents = fs.readFileSync("custom.conf", "utf-8");
  console.log(contents);
}

function runProxy() {
  return new Promise(resolve => {
    var child = spawn("proxychains4", [
      "-f",
      "custom.conf",
      anyproxyPath,
      "--port",
      ANYPROXY_PORT
    ]);

    child.stdout.on("data", function(data) {
      debug("stdout: " + data);
      //Here is where the output goes
      if (data.includes("proxy started")) {
        resolve(child);
      }
    });

    child.stderr.on("data", function(data) {
      debug("stderr: " + data);
      //Here is where the error output goes
      if (data.includes("proxy started")) {
        resolve(child);
      }
    });

    child.on("close", function(code) {
      debug("closing code: " + code);
      //Here you can get the exit code of the script
    });

    /**
     * Child process cleaner
     * https://stackoverflow.com/a/14032965/6161265
     */

    //so the program will not close instantly
    // process.stdin.resume();

    function exitHandler(options, exitCode) {
      child.kill();
      if (options.cleanup) debug("clean");
      if (exitCode || exitCode === 0) debug(exitCode);
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
    process.on(
      "uncaughtException",
      exitHandler.bind(null, { error: true, exit: true })
    );
  });
}

async function setup() {
  await writeConfig();
  return runProxy();
}

module.exports = setup;
