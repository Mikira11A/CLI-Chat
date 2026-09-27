import http from "http";
import fs from "fs";
import path from "path";

import Router from "./router.js";


class Server {
  constructor() {
    this.initRouter()
    this.initServer()
  }

  initRouter() {
    this.router = new Router()
    this.router.registerFile("/", "text/html; charset=utf-8", "/index.html")
    this.router.registerFile("/script/index.js", "text/javascript")
    this.router.registerFile("/script/lib/input-resizer.js", "text/javascript")
    this.router.registerFile("/script/view.js", "text/javascript")
    this.router.registerFile("/script/cli-controller.js", "text/javascript")

    this.router.registerFile("/style/bundle.css", "text/css")
    this.router.registerFile("/style/general.css", "text/css")
    this.router.registerFile("/style/style.css", "text/css")
    this.router.registerFile("/style/blip.css", "text/css")
  }

  initServer() {
    this.server = http.createServer((req, res) => {

      console.log(`Received request: ${req.method}`, req.url)

      if(this.router.checkFile(req.url)) {
        const file_path = path.join(import.meta.dirname, "..", "client", this.router.getFileRoute(req.url))

        fs.readFile(file_path, (err, data) => {
          if (err) {
            this.errorResponse(res, req.url, err)
          }

          res.writeHead(200, {"Content-Type": this.router.getContentType(req.url)})
          res.end(data)
        })
      } else {
        console.log("No file for ", req.url)
      }
    })

    const PORT = process.env.PORT || 1775;
    this.server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }

  errorResponse(res, url, err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error\n");
    console.error(`Error reading file ${url}:`, err);
    return;
  }
}



let server = new Server()
