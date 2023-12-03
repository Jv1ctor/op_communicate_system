const buttonConfirm = document.querySelector("[data-js='button-confirm']")
const form = document.querySelector("[data-js='form-register']")

const submitForm = (e) => {
  e.preventDefault()
  let inputs
  let inputsArr = []
  for (inputs of form.elements) {
    const button = form[8]
    if (inputs !== button) {
      inputsArr.push(Boolean(inputs.value !== "" && inputs.value !== "-1"))
      if (inputs.value === "" || inputs.value === "-1") {
        inputs.classList.add("valid-input")
      }
    }
  }

  const inputValid = inputsArr.every(Boolean)
  if (!buttonConfirm.classList.contains("btn-incomplete") && inputValid) {
    form.submit()
  }
}

export const runSubmitForm = () => {
  form.addEventListener("submit", submitForm)
}
