const reactorName = document.querySelector('[data-js="reactor-name"]')
const tableContainer = document.querySelector("[data-js='tables']")
const tableList = document.querySelectorAll(".main-produto-table")

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
  const table = divTable.querySelector("table")
  const isShowMenu = divTable.classList.contains(context)
  const arrowElement = currentArrow(elemento)
  if (isShowMenu) {
    arrowElement.classList.toggle("active-arrow")
    table.classList.toggle("active-table")
  } else {
    table.classList.remove("active-table")
    arrowElement.classList.remove("active-arrow")
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

renderReactorName()
tableContainer.addEventListener("click", showTablesMenu)
