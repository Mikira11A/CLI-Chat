class InputResizer {
    constructor() {
        this.canvas = document.createElement("canvas")
        this.ctx    = this.canvas.getContext("2d")
    }

    run(input) {
        const style = getComputedStyle(input)

        this.ctx.font = style.font

        const textWidth = this.ctx.measureText(input.value).width
        const paddingLeft = parseFloat(style.paddingLeft) || 0

        const letterSpacing = parseFloat(style.letterSpacing) || 0
        const extraSpacing = Math.max(0, input.value.length - 1) * letterSpacing

        input.style.width = `${textWidth + extraSpacing + paddingLeft + 2}px`
    }

    initInput(input) {
        input.addEventListener("input", (event) => {
            this.run(event.target)
        })
    }
}

export default InputResizer