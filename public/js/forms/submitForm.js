import { buttonConfirm, modalForm, modalFormFinish} from "../config.js"

const titlefinished = document.querySelector(
  "[data-js='product-reactor-title']"
)

const dataStatus = document.querySelector(".data-status")



const verifyFields = (target) => {
  let inputsArr = []
  for (let i = 0; i < target.elements.length - 1; i++) {
    let inputs = target.elements[i]
    inputsArr.push(Boolean(inputs.value !== "" && inputs.value !== "-1"))
    if (inputs.value === "" || inputs.value === "-1") {
      inputs.classList.add("valid-input")
    }
  }
  const inputValid = inputsArr.every(Boolean)
  if (inputValid) {
    return true
  }
}

const submitForm = (e) => {
  e.preventDefault()
  if (!buttonConfirm.classList.contains("btn-incomplete")) {
    const isValid = verifyFields(e.target)

    if (isValid) {
      if(dataStatus){
        return dataStatus.textContent.trim() === "andamento" && e.target.submit()
      }
      e.target.submit()
    }
  }
}

const submitFinishedForm = (e) => {
  e.preventDefault()
  if (!buttonConfirm.classList.contains("btn-incomplete")) {
    const isValid = verifyFields(e.target)
    if (isValid) {
      const finishedProductform =
        titlefinished &&
        e.target.confirm_finished?.value === titlefinished.textContent
      if (finishedProductform) {
        e.target.submit()
        return
      }
      e.target.confirm_finished?.classList.add("valid-input")
    }
  }
}

export const runSubmitForm = () => {
  modalForm?.addEventListener("submit", submitForm)
  modalFormFinish?.addEventListener("submit", submitFinishedForm)
}
