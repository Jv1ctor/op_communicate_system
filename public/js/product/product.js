import { runModal } from "../modal.js"
import { runMenu } from "./menu.js"
import { renderProduto } from "../renders/renderProdutos.js"

const reactorName = document.querySelector('[data-js="reactor-name"]')

const renderReactorName = () => {
  const reactor = localStorage.getItem("reactor")
  const formattedName = reactor.replace("R", " ")
  reactorName.textContent = `Reator ${formattedName}`
}

renderReactorName()
renderProduto()
runModal()
runMenu()
