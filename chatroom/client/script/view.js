class View {
    constructor() {
        this.logContainer = document.getElementById('log-container')
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