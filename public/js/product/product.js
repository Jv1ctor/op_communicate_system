import { runModal } from "../modal.js"
import { runMenu } from "./menu.js"
import { renderProduct, submitFormProduct } from "../renders/renderProdutos.js"
import { runFormattingInput } from "./formattingInputs.js"

const reactorName = document.querySelector('[data-js="reactor-name"]')

const renderReactorName = () => {
  const reactor = localStorage.getItem("reactor")
  const formattedName = reactor.replace("R", " ")
  reactorName.textContent = `Reator ${formattedName}`
}

renderReactorName()
runFormattingInput()
renderProduct()
runModal()
runMenu()
submitFormProduct()
