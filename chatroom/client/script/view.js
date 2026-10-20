// import InputResizer from "./lib/input-resizer.js"

class View {
    constructor() {
        this.log_container = document.getElementById('log-container')
        this.main_input   = document.getElementById("main-input")

        this.main_input.addEventListener('input', () => {
            this.main_input.style.height = 'auto';
            this.main_input.style.height = this.main_input.scrollHeight + 'px'
        })
        this.main_input.focus()
    }

    clearAll() {
        this.log_container.innerHTML = ''
    }

    printMessage(type, user, text) {
        const message_element = document.createElement('div')
        const message_label   = document.createElement('div')
        const message_text    = document.createElement('div')
        message_label.classList.add("log-label" )
        message_text.classList.add("log-message")
        message_label.innerText = `[${user}] :\u00A0`
        message_text.innerText = text
        message_element.appendChild(message_label)
        message_element.appendChild(message_text)

        switch(type) {
            case "message": {}
            default: {break}
            case "error": {
                message_element.style.color = "red"
                break
            }
            case "success": {
                message_element.style.color = "green"
                break
            }
        }

        this.log_container.appendChild(message_element)
    }

    setTitle(title) {
        document.title = title
    }
}

export default View;