import { modal, modalFinish, buttonModal, buttonModalFinish } from "./config.js"

const openModalProduct = (e) => {
  modal.classList.toggle("show-modal")
  document.body.classList.toggle("show-modal")
}

export const openModalFinish = (e) => {
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
