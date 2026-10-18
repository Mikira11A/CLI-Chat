import View from "./view.js"

class CLIController {
    constructor() {
        this.view = new View()
        this.commands = {}
        this.user_name = "unknown"
        this.room = undefined
        //this.WS_URL = 'wss://amtybe.duckdns.org'
        this.WS_URL = 'ws://localhost:1775'
        this.ws = undefined


        this.loadComands()
    }

    loadComands() {
        this.registerCommand("clear", 
            (args) => {
                this.view.clearAll()
            }
        )
        this.registerCommand("exit", 
            (args) => {
                if (this.ws.readyState === WebSocket.CLOSED || this.ws.readyState === WebSocket.CLOSING) {
                    this.print("SYSTEM", "message", `DISCONNECTING FROM ${this.room}`)
                    this.ws.close()
                } else {

                }
            }
        )
        this.registerCommand("join", 
            (args) => {

                if(this.room === args[0] && this.user_name === args[1]) {
                    this.print("SYSTEM", "error", `MIRACULOUSLY YOU ALREADY THERE`)
                    return
                }

                this.ws = new WebSocket(this.WS_URL)
                this.ws.addEventListener('error', () => {
                    this.print("SYSTEM", "error", "FAILED TO CONNECT")
                })

                this.ws.addEventListener('open', () => {
                    this.ws.send(JSON.stringify({
                        "room" : args[0],
                        "user" : args[1],
                        "secret" : args[2]
                     }))


                    this.ws.addEventListener('message',async (event) => {
                        let msg
                        try { 
                            msg = JSON.parse(event.data) 
                        } catch {
                            this.print("SYSTEM", "error", "FAILED TO RECIEVE MESSAGE")
                            return
                        }
                        console.log(msg)

                        if(msg.user === undefined || msg.message === undefined || msg.type === undefined || msg.code === undefined) {
                            this.print("SYSTEM", "error", "INVALID MESSAGE RECIEVED")
                            return
                        }
                        switch(msg.code) {
                            default: {
                                this.print(msg.user, msg.type, msg.message)
                                break
                            }
                            case 50: {
                                if (this.ws.readyState !== WebSocket.CLOSED || this.ws.readyState !== WebSocket.CLOSING) {
                                    if(this.room !== undefined && this.user_name !== "unknown") {
                                        this.print("SYSTEM", "message", `DISCONNECTING FROM ${this.room}...`)
                                        await this.closeWebSocket(this.ws)
                                    }
                                }
                                this.print(msg.user, msg.type, msg.message)
                                this.view.setTitle(msg.data.room)
                                this.room = msg.data.room
                                this.user_name = msg.data.user
                                break
                            }
                        }
                    })

                    this.ws.addEventListener("close", (event) => {
                        this.user_name = "unknown"
                        this.room = undefined
                        this.print("SYSTEM", "error", `CONNECTION TERMINATED`)
                    })

                })
            }
        )
    }

    initInput() {
        this.view.main_input.addEventListener("keydown", (event) => {
            let message = event.currentTarget.value

            if (event.key === "Enter") {
                if (message.startsWith("/")) {
                    this.parseCommand(message)                
                } else {
                    this.print(this.user_name, "message", message)
                }

                event.currentTarget.value = ""
                this.view.input_resizer.run(this.view.main_input)
            }
        });
    }

    parseCommand(str) {
        const [command, ...args] = str.slice(1).split(/\s+/)
        // console.log({ command, args })
        this.executeCommand(command, args)
    }
    executeCommand(command, args) {
        const func = this.commands[command]
        if(func != undefined)
            func(args)
        else {
            this.printCommonError(`unknown command: ${command}`)
        }
    }
    registerCommand(command, func) {
        this.commands[command] = func
    }

    closeWebSocket(ws) {
        return new Promise((resolve) => {
            if (ws.readyState === WebSocket.CLOSED) {
                resolve()
                return
            }
            ws.addEventListener('close', resolve, { once: true })
            ws.close()
        })
    }

    //==========================================

    print(source, type, message) {
        this.view.printMessage( type,
            this.view.formMessage(
                source,
                message
            )
        )
    }
    
}

export default CLIController