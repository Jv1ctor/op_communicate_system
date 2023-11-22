import { modalForm } from "../config.js"

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

export const runFormattingInput = () => {
  modalForm.addEventListener("input", formattingInputs)
}
