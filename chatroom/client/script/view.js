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

    printMessage(text) {
        const messageElement = document.createElement('div')
        messageElement.textContent = text
        this.logContainer.appendChild(messageElement)
    }

    formMessage(user, text) {
        return `[${user}] ${text}`
    }
}

export default View;