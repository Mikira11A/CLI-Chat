import View from "./view.js"

class CLIController {
    constructor() {
        this.view = new View()
        this.commands = {}
        this.user_name = "unknown"
        //this.WS_URL = 'wss://amtybe.duckdns.org'
        this.WS_URL = 'ws://localhost:1775'
        this.ws


        this.loadComands()
    }

    loadComands() {
        this.registerCommand("clear", 
            (args) => {
                this.view.clearAll()
            }
        )
        this.registerCommand("join", 
            (args) => {
                //this.printCommon(`${args[0]} | ${args[1]}`)
                this.ws = new WebSocket(this.WS_URL)
                this.ws.addEventListener('error', () => {
                    this.printCommonError("connection failed")
                })

                this.ws.addEventListener('open', () => {
                    this.ws.send(JSON.stringify({
                        "room" : args[0],
                        "user" : args[1],
                        "secret" : args[2]
                     }))


                    this.ws.addEventListener('message', (event) => {
                        this.printCommon(JSON.stringify(event.data))
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
                    this.printCommon(message)
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

    //==========================================

    printCommon(message) {
        this.view.printMessage(
            this.view.formMessage(
                this.user_name,
                message
            )
        )
    }
    printCommonError(message) {
        this.view.printMessage(
            this.view.formMessage(
                `system`,
                message
            )
        )
    }
}

export default CLIController