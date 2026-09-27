import View from "./view.js"

class CLIController {
    constructor() {
        this.view = new View()
        this.commands = {}
        this.user_name = "unknown"

        this.loadComands()
    }

    loadComands() {
        this.registerCommand("clear", 
            (args) => {
                this.view.clearAll()
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
                    this.view.printMessage(
                        this.view.formMessage(
                            this.user_name,
                            message
                        )
                    )
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
    }
    registerCommand(command, func) {
        this.commands[command] = func
    }
}

export default CLIController