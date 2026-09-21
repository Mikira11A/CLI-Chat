import InputResizer from "./lib/input-resizer.js"
import View from "./view.js"

const inputResizer = new InputResizer()
const view = new View()

window._VIEW = view

let main_input = document.getElementById("main-input")
main_input.addEventListener("input", (event) => {
  inputResizer.run(event.target)
})