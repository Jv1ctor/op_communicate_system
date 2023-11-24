import { runModal } from "../modal.js"
import {
  renderAnalyse,
  renderProductData,
  submitFormAnalyse,
} from "../renders/renderAnalyse.js"
import { verifyGenerateToken } from "../user/token.js"

const productName = document.querySelector("[data-js='product-name']")
const titleFormFinish = document.querySelector("[data-js='product-reactor-title']")

const renderProductName = () => {
  const product = JSON.parse(localStorage.getItem("product"))
  const reactor = localStorage.getItem("reactor")
  productName.textContent = product.product_name
  titleFormFinish.textContent = `${product.product_name.toUpperCase()}-${reactor.toUpperCase()}`
}

verifyGenerateToken()
  .then((token) => {
    renderProductData(null, token)
    renderAnalyse(null, token)
  })
  .catch((err) => console.log(err))

renderProductName()
runModal()
submitFormAnalyse()
