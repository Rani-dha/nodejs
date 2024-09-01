const http = require("http");
const { request } = require("https");

const server = http.createServer((req, res) => {
    console.log(req.url, req.method, req.headers);
    // process.exit;

    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My Node JS page</title></head>');
    res.write('<body><h1>Hey, This is my Node Js page</h1></body>');
    res.write("</html>");
});

server.listen(3000);
