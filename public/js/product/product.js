import { runModal } from "../modal.js"
import { runMenu } from "./menu.js"
import { renderProduct, submitFormProduct } from "../renders/renderProdutos.js"
import { runFormattingInput } from "./formattingInputs.js"
import { verifyGenerateToken } from "../user/token.js"

const reactorName = document.querySelector('[data-js="reactor-name"]')
const tables = document.querySelector("[data-js='tables']")
const tablesBody = document.querySelectorAll(".produto-table-body")

const renderReactorName = () => {
  const reactor = localStorage.getItem("reactor")
  const formattedName = reactor.replace("R", " ")
  reactorName.textContent = `Reator ${formattedName}`
}

const saveProductName = (e) => {
  if (e.target.dataset.js === "link-product-btn") {
    const productName = e.target.dataset.name
    const productId = e.target.dataset.id
    const productStatus = e.target.dataset.status
    localStorage.setItem(
      "product",
      JSON.stringify({
        product_name: productName,
        product_id: productId,
        product_status: productStatus,
      }),
    )
  }
}

tablesBody.forEach((item) => {
  const reactor = localStorage.getItem("reactor")
  item.dataset.js += `-${reactor}`
})

verifyGenerateToken()
  .then((token) => {
    renderProduct(null, "andamento", token)
    renderProduct(null, "aprovado", token)
    renderProduct(null, "reprovado", token)
  })
  .catch((err) => console.log(err))
renderReactorName()
runFormattingInput()
runModal()
runMenu()
submitFormProduct()
tables.addEventListener("click", saveProductName)
