export const modal = document.querySelector("[data-js='modal']")
const buttonModal = document.querySelector("[data-js='open-modal']")
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

const formatWithRegex = (event, regex) => {
  const value = event.target.value
  const match = value.match(regex)

  event.target.value = value.replace(regex, "")
  if (match) {
    event.target.classList.add("input-error")
  } else {
    event.target.classList.remove("input-error")
  }
}

const formattingInputs = (e) => {
  if (e.target.dataset.type === "number") {
    const regex = /\D/g
    formatWithRegex(e, regex)
  }

  if (e.target.dataset.type === "decimal") {
    const regex = /[^\d.]/
    formatWithRegex(e, regex)
  }

  if (e.target.dataset.type === "string") {
    const regex = /[^A-Za-záàâãéèêíìóòôõúùûçÁÀÂÃÉÈÊÍÌÓÒÔÕÚÙÛÇ\s]/g
    formatWithRegex(e, regex)
  }
}

export const runModal = () => {
  modalForm.addEventListener("input", formattingInputs)
  buttonModal.addEventListener("click", openModalProduct)
  modal.addEventListener("click", closeModalProduct)
}
