import { runSubmitForm } from "../forms/submitForm.js"
import { openModalFinish } from "../modal.js"
import { buttonModalFinish, buttonConfirm } from "../config.js"

const analyseList = document.querySelector("[data-js='analyse-list']")
const dataStatus = document.querySelector(".data-status")
const message = document.createElement("p")
const typeUser = sessionStorage.getItem("type-user")

const boxConfirm = (analyseId) => {
  const template = `<div class="confirm-analyse-box" data-js="box-confirm">
  <div>
    <h3 class="confirm-analyse-title">Confirmar Ajuste?</h3>
    <div class="confirm-analyse-options">
      <a class="options confirm" href="/checked-analysis/${analyseId}">Sim</a>
      <p class="options not-confirm">Não</p>
    </div>
  </div>
  </div>`

  return template
}

const formattingHTMLDataAnalyse = (data) => {
  const currentDate = new Date(data.created_at)
  const formattingDate = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(currentDate)
  let template = `<li class="list-analise-item" id="${data.analysis_id}">
                  <div class="list-analise-container">
                    <h3>Análise ${data.count}</h3>
                    <p>${data.adjustment}</p>

                    <span>${formattingDate}</span>
                    <div class="options_analysis">
                      <i
                        class="fa-solid fa-check checked-adjustment ${
                          data.checked && "checked-style"
                        }"
                        data-js="checked-button"></i>

                      <i class="fa-solid fa-pen-to-square edit-adjustment"></i>
                    </div>
                  </div>
                  ${typeUser === "Produção" && boxConfirm(data.analysis_id)}
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
  if (!dataStatus.classList.contains("andamento") || analyseList.children.length <= 0) {
    buttonModalFinish.removeEventListener("click", openModalFinish)
    buttonModalFinish.classList.add("btn-incomplete")
  }

  if (!dataStatus.classList.contains("andamento")) {
    buttonConfirm.classList.add("btn-incomplete")
  }
  if (analyseList.children.length <= 0) {
    message.innerHTML = "<p class='not-analise-title'>Sem Análise do Produto</p>"
    analyseList.append(message)
  }

  runSubmitForm()
}

export const productStatus = (data) => {
  dataStatus.textContent = data.status
  dataStatus.classList.replace("andamento", data.status)
}

export const renderConfirmAnalyse = (data) => {
  if (data) {
    const analyse = document.getElementById(data.analysisId)
    if (analyse) {
      const checked = analyse.querySelector("[data-js='checked-button']")

      data && checked.classList.add("checked-style")
    }
  }
}
