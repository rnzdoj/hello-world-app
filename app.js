const http = require('http');
const PORT = process.env.PORT || 8080;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Hello World from Kubernetes!\n');
}).listen(PORT, () => console.log(`Server running on port ${PORT}`));
