const http = require("http");
const { request } = require("https");

const server = http.createServer((req, res) => {
  console.log(req);
  // process.exit;
});

server.listen(3000);
