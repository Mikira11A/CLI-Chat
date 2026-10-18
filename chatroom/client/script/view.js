import InputResizer from "./lib/input-resizer.js"

class View {
    constructor() {
        this.logContainer = document.getElementById('log-container')
        this.main_input   = document.getElementById("main-input")

        this.input_resizer = new InputResizer()
        this.input_resizer.initInput(this.main_input)
    }

    clearAll() {
        this.logContainer.innerHTML = ''
    }

    printMessage(type, text) {
        const messageElement = document.createElement('div')
        messageElement.textContent = text
        switch(type) {
            case "message": {}
            default: {break}
            case "error": {
                messageElement.style.color = "red"
                break
            }
            case "success": {
                messageElement.style.color = "green"
                break
            }
        }
        this.logContainer.appendChild(messageElement)
    }

    formMessage(user, text) {
        return `[${user}] ${text}`
    }

    setTitle(title) {
        document.title = title
    }
}

export default View;