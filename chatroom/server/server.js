import http from "http";
import fs from "fs";
import path from "path";
import crypto from 'crypto';

import { WebSocketServer } from "ws"

import Router from "./router.js";


class Server {
  constructor() {
    this._secret_switch = false

    this.server
    this.wss
    this.rooms = {}
    this.users = {}
    
    this.initData(  )
    this.initRouter()
    this.initServer()
  }

  initData() {
    fs.readFile(path.join(import.meta.dirname, "data", "users.json"), "utf8", (err, data) => {
      if (err) {
        this.errorResponse(res, req.url, err)
        process.exit()
      }
      this.users = JSON.parse(data)
      console.log(`LOADED ${Object.keys(this.users).length} USERS`)
    })
    fs.readFile(path.join(import.meta.dirname, "data", "rooms.json"), "utf8", (err, data) => {
      if (err) {
        this.errorResponse(res, req.url, err)
        process.exit()
      }
      this.rooms = JSON.parse(data)
      console.log(`LOADED ${Object.keys(this.rooms).length} ROOMS`)
    })
  }



  initRouter() {
    this.router = new Router()
    this.router.registerFile("/", "text/html; charset=utf-8",    "/index.html")
    this.router.registerFile("/script/index.js",             "text/javascript")
    this.router.registerFile("/script/lib/input-resizer.js", "text/javascript")
    this.router.registerFile("/script/view.js",              "text/javascript")
    this.router.registerFile("/script/cli-controller.js",    "text/javascript")

    this.router.registerFile("/style/bundle.css",  "text/css")
    this.router.registerFile("/style/general.css", "text/css")
    this.router.registerFile("/style/style.css",   "text/css")
    this.router.registerFile("/style/blip.css",    "text/css")
  }

  initServer() {
    this.server = http.createServer((req, res) => {

      console.log(`Received request: http://${req.headers.host}${req.url}`)

      if(this.router.checkFile(req.url) && !this._secret_switch) {
        const file_path = path.join(import.meta.dirname, "..", "client", this.router.getFileRoute(req.url))
        
        fs.readFile(file_path, (err, data) => {
          if (err) {
            this.errorResponse(res, req.url, err)
          }

          res.writeHead(200, {"Content-Type": this.router.getContentType(req.url)})
          res.end(data)
        })
      } else if (`http://${req.headers.host}${req.url}` == 'http://localhost:1775/secret.html' && this._secret_switch) {
          this.sendSecret(res)
      } else{
        console.log("No file for ", req.url)
      }
    })

    const PORT = process.env.PORT || 1775
    this.wss = new WebSocketServer({server: this.server})

    this.server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
    this.wss.on("connection", (ws, req) => {
      console.log(`WS CONNECTION: ${req.headers.origin} | ${req.headers["user-agent"]} | ${req.socket.remoteAddress}`)
      let user_auth = false
      const timeout = setTimeout(() => !user_auth && ws.close(), 5000)
      
      ws.once('message', (data) => {
        
        let msg
        try { 
          msg = JSON.parse(data) 
        } catch {
          return ws.close() 
        }

        console.log(msg);
        
           
        if(!msg.user && !msg.secret) ws.close()
        
        let user = this.users[msg.user]
        if(user === undefined) {
          this.sendSYSTEM(ws, 0, "error", "AUTHENTICATION FAILED")
          ws.close()
          return
        }

        let storedBuffer = Buffer.from(user.hash, 'hex')
        let submittedBuffer = crypto.createHash('sha256').update(msg.secret).digest()
        if(crypto.timingSafeEqual(submittedBuffer, storedBuffer)) {
          //=============
          user_auth = true
          console.log(`user ${msg.user} has entered room ${msg.room}`)
          this.sendSYSTEM(ws, 50, "success", "AUTHENTICATION PASSED", {
            user: msg.user,
            room: msg.room
          })
        } else {
          this.sendSYSTEM(ws, 0, "error", "AUTHENTICATION FAILED")
          ws.close()
        }
      })
    })
  }

  errorResponse(res, url, err) {
    res.writeHead(500, { "Content-Type": "text/plain" })
    res.end("Internal Server Error\n")
    console.error(`Error reading file ${url}:`, err)
    return
  }

  sendSecret(res) {
    const secret = crypto.randomBytes(32).toString('base64url')
    const hash   = crypto.createHash('sha256').update(secret).digest('hex')

    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8'
    });

    res.end(JSON.stringify({
      secret: secret,
      hash: hash
    }))
  }

  sendSYSTEM(ws, code, type, message, data) {
    let json = {
      code: code,
      type: type,
      user: "SYSTEM",
      message: message
    }
    if(data) json.data = data
    ws.send(JSON.stringify(json))
  }
}



let server = new Server()
