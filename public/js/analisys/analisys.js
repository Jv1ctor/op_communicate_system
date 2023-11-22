import { runModal } from "../modal.js"
import {
  renderAnalyse,
  renderProductData,
  submitFormAnalyse,
} from "../renders/renderAnalyse.js"

const productName = document.querySelector("[data-js='product-name']")
const renderProductName = () => {
  const product = JSON.parse(localStorage.getItem("product"))

  productName.textContent = product.product_name
}

renderProductName()
renderProductData()
runModal()
submitFormAnalyse()
renderAnalyse()
