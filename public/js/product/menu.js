const tableContainer = document.querySelector("[data-js='tables']")
const tableList = document.querySelectorAll(".main-produto-table")

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
  const table = divTable.querySelector("[data-js='table-produto']")
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

export const runMenu = () => {
  tableContainer.addEventListener("click", showTablesMenu)
}
