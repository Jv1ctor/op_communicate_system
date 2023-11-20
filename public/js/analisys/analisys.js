import { runModal } from "../modal.js"

const productName = document.querySelector("[data-js='product-name']")
const renderProductName = () => {
  const query = window.location.search
  const params = new URLSearchParams(query)
  const name = params.get("analise")
  productName.textContent = `${name}`
}

renderProductName()
runModal()
