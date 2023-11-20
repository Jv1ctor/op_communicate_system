export const modal = document.querySelector("[data-js='modal']")
export const buttonModal = document.querySelector("[data-js='open-modal']")
export const modalForm = document.querySelector("[data-js='form-register']")

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

export const runModal = () => {
  buttonModal.addEventListener("click", openModalProduct)
  modal.addEventListener("click", closeModalProduct)
}
