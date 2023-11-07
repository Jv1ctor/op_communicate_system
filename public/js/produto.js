const reactorName = document.querySelector('[data-js="reactor-name"]')
const tableContainer = document.querySelector("[data-js='tables']")
const tableList = document.querySelectorAll(".main-produto-table")

const modal = document.querySelector("[data-js='modal']")
const buttonAddProduct = document.querySelector("[data-js='add-product']")
const modalForm = document.querySelector("[data-js='form-register-product']")

const renderReactorName = () => {
  const query = window.location.search
  const params = new URLSearchParams(query)
  const name = params.get("reactor")

  reactorName.textContent = `Reator ${name}`
}

const currentArrow = (elemento) => {
  const existArrow = elemento.classList.contains("arrow")
  let arrowElement = ""
  if (existArrow) {
    return (arrowElement = elemento)
  } else {
    return (arrowElement = elemento.children[1])
  }
}

const menuEvent = (context, divTable, elemento) => {
  const table = divTable.querySelector("data-js='table-produto'")
  const isShowMenu = divTable.classList.contains(context)
  const arrowOther = divTable.querySelector(".arrow")
  if (isShowMenu) {
    const arrowElement = currentArrow(elemento)
    arrowElement.classList.toggle("active-arrow")
    table.classList.toggle("active-table")
  } else {
    table.classList.remove("active-table")
    arrowOther.classList.remove("active-arrow")
  }
}

const showTablesMenu = (e) => {
  tableList.forEach((divTable) => {
    if (e.target.dataset.js === "show-andamento") {
      menuEvent("andamento", divTable, e.target)
    }
    if (e.target.dataset.js === "show-aprovados") {
      menuEvent("aprovados", divTable, e.target)
    }
    if (e.target.dataset.js === "show-reprovados") {
      menuEvent("reprovados", divTable, e.target)
    }
  })
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

renderReactorName()
modalForm.addEventListener("input", formattingInputs)
buttonAddProduct.addEventListener("click", openModalProduct)
modal.addEventListener("click", closeModalProduct)
tableContainer.addEventListener("click", showTablesMenu)
