const analyseList = document.querySelector("[data-js='analyse-list']")
const titleNotAnalyse = document.querySelector(".not-analise-title")
const productDataContainer = document.querySelector("[data-js='data-product']")
const buttonAnalysisSubmit = document.querySelector("[data-js='button-analysis-submit']")
const dataStatus = document.querySelector(".data-status")
const message = document.createElement("p")

const formattingHTMLDataAnalyse = (data) => {
  const currentDate = new Date(data.created_at)
  const formattingDate = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(currentDate)
  let template = `<li class="list-analise-item">
                  <h3>Análise ${data.count}</h3>
                  <p>${data.adjustment}</p>
                  <span>${formattingDate}</span>
                </li>`

  return template
}

export const renderAnalyse = async (data) => {
  const [_, product] = document.location.pathname
    .replace("/reator/produto/", "")
    .split(".")
  if (data && product === data.fk_product) {
    message.remove()
    const formatData = formattingHTMLDataAnalyse(data)
    analyseList.innerHTML += formatData
  }
  if (analyseList.children.length <= 0) {
    message.innerHTML = "<p class='not-analise-title'>Sem Análise do Produto</p>"
    analyseList.append(message)
  }

  // if (product.product_status !== "andamento") {
  //   buttonModalFinish.removeEventListener("click", openModalFinish)
  //   buttonAnalysisSubmit.classList.add("btn-incomplete")
  //   buttonModalFinish.classList.add("btn-incomplete")
  // }
}

export const productStatus = (data) => {
  dataStatus.textContent = data.status
  dataStatus.classList.remove("andamento")
  dataStatus.classList.add(data.status)
}