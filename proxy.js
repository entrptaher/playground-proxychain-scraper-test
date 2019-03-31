const AnyProxy = require("anyproxy");

const options = {
  port: 8001,
  webInterface: {
    enable: false
  },
  forceProxyHttps: false,
  wsIntercept: false,
  silent: false
};
const proxyServer = new AnyProxy.ProxyServer(options);

proxyServer.on("ready", () => {
  console.log("Proxy ready");
});
proxyServer.on("error", e => {
  console.log(e);
});

proxyServer.start();
