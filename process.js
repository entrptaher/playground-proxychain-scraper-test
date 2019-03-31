const fs = require('fs');
require("dotenv").config();

const pre =`random_chain
quiet_mode
proxy_dns
tcp_read_time_out 15000
tcp_connect_time_out 8000

[ProxyList]
`;

const proxies = Object.entries(process.env)
  .filter(([key]) => key.includes("PROXY"))
  .map(([key, value])=>value)
  .join('\n')

fs.writeFileSync('custom.conf', pre + proxies)
console.log(proxies);
