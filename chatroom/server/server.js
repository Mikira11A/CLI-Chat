import http from "http";
import fs from "fs";
import path from "path";

const indexPath = path.join(import.meta.dirname, "..", "client", "index.html");

const server = http.createServer((req, res) => {
  console.log(`Received request: ${req.method} ${req.url}`);

  fs.readFile(indexPath, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error\n");
      console.error("Error reading index.html:", err);
      return;
    }

    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"})
    res.end(data)
  });

  // res.writeHead(200, { "Content-Type": "text/plain" });
  // res.end("Hello, World!\n");
});

const PORT = process.env.PORT || 1775;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});