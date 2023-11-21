import { runModal } from "../modal.js"
import { runMenu } from "./menu.js"
import { renderProduct, submitFormProduct } from "../renders/renderProdutos.js"
import { runFormattingInput } from "./formattingInputs.js"

const reactorName = document.querySelector('[data-js="reactor-name"]')
const tables = document.querySelector("[data-js='tables']")

const renderReactorName = () => {
  const reactor = localStorage.getItem("reactor")
  const formattedName = reactor.replace("R", " ")
  reactorName.textContent = `Reator ${formattedName}`
}

const saveProductName = (e) => {
  if (e.target.dataset.js === "link-product-btn") {
    const productName = e.target.dataset.name
    const productId = e.target.dataset.id

    localStorage.setItem(
      "product",
      JSON.stringify({ product_name: productName, product_id: productId }),
    )
  }
}

renderReactorName()
runFormattingInput()
renderProduct()
runModal()
runMenu()
submitFormProduct()
tables.addEventListener("click", saveProductName)
