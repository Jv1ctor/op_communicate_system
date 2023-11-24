import {
  modal,
  modalForm,
  modalFormFinish,
  buttonModalFinish,
  modalFinish,
} from "../config.js"
import { openModalFinish } from "../modal.js"
import {
  fetchCreateAnalysis,
  fetchFinishProduct,
  fetchListAnalysis,
  fetchListProduct,
} from "../user/fetch.js"
import { verifyGenerateToken, generateToken } from "../user/token.js"

const analyseList = document.querySelector("[data-js='analyse-list']")
const titleNotAnalyse = document.querySelector(".not-analise-title")
const analyseListArr = analyseList?.children
const productDataContainer = document.querySelector("[data-js='data-product']")

export const submitFormAnalyse = async () => {
  const createAnalyse = async (e) => {
    e.preventDefault()
    const inputValue = e.target["analise-text"].value
    const product = JSON.parse(localStorage.getItem("product"))
    const data = {
      adjustment: inputValue,
      product_id: product.product_id,
    }

    if (data && inputValue) {
      const newToken = await generateToken()
      const response = await fetchCreateAnalysis(newToken, data)
      if (response) {
        modalForm.reset()
        modal.classList.toggle("show-modal")
        document.body.classList.toggle("show-modal")
      }
    }
  }

  const finishProduct = async (e) => {
    e.preventDefault()
    const statusProduct = e.target.status.value
    const productAndReactor = e.target["product-reactor"].value
    const analystName = e.target["name-analyst"].value
    const product = JSON.parse(localStorage.getItem("product"))
    const reactor = localStorage.getItem("reactor")
    const data = {
      product_id: product.product_id,
      product_analyst: analystName,
      product_status: statusProduct,
    }

    const confirm =
      productAndReactor.toLowerCase() ===
      `${product.product_name}-${reactor.toLowerCase()}`
    if (statusProduct && productAndReactor && analystName && confirm) {
      const newToken = await generateToken()
      const response = await fetchFinishProduct(newToken, data)
      if (response) {
        modalFormFinish.reset()
        modalFinish.classList.toggle("show-modal")
        document.body.classList.toggle("show-modal")
      }
    }
  }

  modalForm.addEventListener("submit", createAnalyse)
  modalFormFinish.addEventListener("submit", finishProduct)
}

const formattingHTMLDataAnalyse = (data) => {
  let template = ""
  data.forEach((analyse, index) => {
    const currentDate = new Date(analyse.created_at)
    const formattingDate = new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(currentDate)
    template += `<li class="list-analise-item">
                  <h3>Análise ${analyse.count ? analyse.count : index + 1}</h3>
                  <p>${analyse.adjustment}</p>
                  <span>${formattingDate}</span>
                </li>`
  })

  return template
}

const formattingHTMLDataProduct = (data) => {
  const product = data[0]
  const currentDate = new Date(product.created_at)
  const formattingDate = new Intl.DateTimeFormat("pt-BR").format(currentDate)
  return `
    <span><strong>Nome:</strong> ${product.name_product}</span>
    <span><strong>Número-Roteiro:</strong> ${product.num_roadmap}</span>
    <span><strong>Número-OP:</strong> ${product.num_op}</span>
    <span><strong>Operador:</strong> ${product.operator}</span>
    <span><strong>Supervisor de Turno:</strong> ${product.turn_supervisor}</span>
    <span><strong>Reator:</strong> ${product.reactor}</span>
    <span><strong>Quantidade:</strong> ${product.quant_produce}kg</span>
    <span><strong>Número-Lote:</strong>${product.num_batch} </span>
    <span><strong>Turno:</strong>${product.turn}</span>
    <span><strong>Status:</strong>${product.status}</span>
    <span><strong>Data:</strong> ${formattingDate}</span>`
}

export const renderAnalyse = async (data, token) => {
  if (data) {
    titleNotAnalyse.remove()
    buttonModalFinish.classList.remove("btn-incomplete")
    buttonModalFinish.addEventListener("click", openModalFinish)
    data.count = analyseListArr.length + 1
    const formatData = formattingHTMLDataAnalyse([data])
    analyseList.innerHTML += formatData
  } else {
    if (token) {
      const product = JSON.parse(localStorage.getItem("product"))
      const response = await fetchListAnalysis(token, product.product_id)
      if (response) {
        const { analyse_list: analyse } = response
        if (analyse.length > 0) {
          const formatData = formattingHTMLDataAnalyse(analyse)
          analyseList.innerHTML = formatData
        } else {
          buttonModalFinish.classList.add("btn-incomplete")
          buttonModalFinish.removeEventListener("click", openModalFinish)
        }
      } else {
        localStorage.removeItem("access-token")
        window.location.reload()
      }
    }
  }
}

export const renderProductData = async (data, token) => {
  if (data) {
    const formatData = formattingHTMLDataProduct(data)
    productDataContainer.innerHTML = formatData
  }

  if (token) {
    const reactor = localStorage.getItem("reactor")
    const product = JSON.parse(localStorage.getItem("product"))
    const response = await fetchListProduct(
      token,
      reactor,
      product.product_id,
      product.product_status,
    )
    if (response) {
      const { product_list: productList } = response
      if (productList.length > 0) {
        const formatData = formattingHTMLDataProduct(productList)
        productDataContainer.innerHTML = formatData
      }
    } else {
      localStorage.removeItem("access-token")
      window.location.reload()
    }
  }
}
