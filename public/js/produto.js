const reactorName = document.querySelector('[data-js="reactor-name"]')
const tableContainer = document.querySelector("[data-js='tables']")
const tableList = document.querySelectorAll(".main-produto-table")
const renderReactorName = () => {
  const query = window.location.search
  const params = new URLSearchParams(query)
  const name = params.get("reactor")

  reactorName.textContent = `Reator ${name}`
}

const hiddenTables = () => {}

renderReactorName()

tableContainer.addEventListener("click", (e) => {
  tableList.forEach((divTable) => {
    if (e.target.dataset.js === "show-andamento") {
      const table = divTable.querySelector("table")
      const arrow = divTable.querySelector(".arrow")
      if (divTable.classList.contains("andamento")) {
        let arrow = ""
        if (e.target.classList.contains("arrow")) {
          arrow = e.target
        } else {
          arrow = e.target.children[1]
        }

        arrow.classList.toggle("active-arrow")
        table.classList.toggle("active-table")
      } else {
        table.classList.remove("active-table")
        arrow.classList.remove("active-arrow")
      }
    }

    if (e.target.dataset.js === "show-aprovados") {
      const table = divTable.querySelector("table")
      const arrow = divTable.querySelector(".arrow")
      if (divTable.classList.contains("aprovados")) {
        let arrow = ""
        if (e.target.classList.contains("arrow")) {
          arrow = e.target
        } else {
          arrow = e.target.children[1]
        }

        arrow.classList.toggle("active-arrow")
        table.classList.toggle("active-table")
      } else {
        table.classList.remove("active-table")
        arrow.classList.remove("active-arrow")
      }
    }

    if (e.target.dataset.js === "show-reprovados") {
      const table = divTable.querySelector("table")
      const arrow = divTable.querySelector(".arrow")
      if (divTable.classList.contains("reprovados")) {
        let arrow = ""
        if (e.target.classList.contains("arrow")) {
          arrow = e.target
        } else {
          arrow = e.target.children[1]
        }

        arrow.classList.toggle("active-arrow")
        table.classList.toggle("active-table")
      } else {
        table.classList.remove("active-table")
        arrow.classList.remove("active-arrow")
      }
    }
  })
})
