const http = require('http');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 8000;
const root = process.cwd();

const server = http.createServer((req, res) => {
  let urlPath = req.url === '/' ? '/index.html' : req.url;
  let filePath = path.join(root, urlPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('Not found');
      return;
    }
    let ext = path.extname(filePath).toLowerCase();
    let contentType = 'text/html';
    if (ext === '.js') contentType = 'application/javascript';
    if (ext === '.css') contentType = 'text/css';
    if (ext === '.svg') contentType = 'image/svg+xml';
    res.writeHead(200, {'Content-Type': contentType});
    res.end(data);
  });
});

server.listen(port, () => console.log(`simple server listening on ${port}`));
