import { runModal } from "../modal.js"

const productName = document.querySelector("[data-js='product-name']")
const renderProductName = () => {
  const product = JSON.parse(localStorage.getItem("product"))

  productName.textContent = product.product_name
}

renderProductName()
runModal()
