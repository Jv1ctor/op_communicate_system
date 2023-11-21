export const modal = document.querySelector("[data-js='modal']")
export const modalFinish = document.querySelector("[data-js='modal-finish']")
export const buttonModal = document.querySelector("[data-js='open-modal']")
export const buttonModalFinish = document.querySelector("[data-js='open-modal-finish']")
export const modalForm = document.querySelector("[data-js='form-register']")

const openModalProduct = (e) => {
  modal.classList.toggle("show-modal")
  document.body.classList.toggle("show-modal")
}

const openModalFinish = (e) => {
  modalFinish.classList.toggle("show-modal")
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

const closeModalFinish = (e) => {
  if (e.target.dataset.js === "button-exit") {
    modalFinish.classList.toggle("show-modal")
    document.body.classList.toggle("show-modal")
  }

  if (e.target.dataset.js === "modal-finish") {
    modalFinish.classList.toggle("show-modal")
    document.body.classList.toggle("show-modal")
  }
}

export const runModal = () => {
  buttonModal.addEventListener("click", openModalProduct)
  buttonModalFinish?.addEventListener("click", openModalFinish)
  modal.addEventListener("click", closeModalProduct)
  modalFinish?.addEventListener("click", closeModalFinish)
}
