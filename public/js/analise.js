const productName = document.querySelector("[data-js='product-name']")

const modal = document.querySelector("[data-js='modal']")
const buttonAddProduct = document.querySelector("[data-js='add-analise']")
const modalForm = document.querySelector("[data-js='form-register-analise']")
const renderProductName = () => {
  const query = window.location.search
  const params = new URLSearchParams(query)
  const name = params.get("analise")
  productName.textContent = `${name}`
}

const openModalProduct = (e) => {
  modal.classList.toggle("show-modal")
  document.body.classList.toggle("show-modal")
}

const closeModalProduct = (e) => {
  if (e.target.dataset.js === "button-exit") {
    modal.classList.toggle("show-modal")
    document.body.classList.toggle("show-modal")
  }

  if (e.target.dataset.js === "modal") {
    modal.classList.toggle("show-modal")
    document.body.classList.toggle("show-modal")
  }
}

renderProductName()
// modalForm.addEventListener("input", formattingInputs)
buttonAddProduct.addEventListener("click", openModalProduct)
modal.addEventListener("click", closeModalProduct)
