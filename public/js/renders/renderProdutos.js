import { fetchCreateProduct, fetchListProduct } from "../user/fetch.js"
import { generateToken } from "../user/token.js"
import { modal, modalForm } from "../config.js"

const buttonConfirm = document.querySelector("[data-js='button-confirm']")

export const submitFormProduct = async () => {
  const createProduct = async (e) => {
    e.preventDefault()
    const listInputValue = Array.from(e.target)
    const data = listInputValue.reduce((acc, item) => {
      if (!item.classList.contains("button")) {
        if (item.value && modalForm.turn.value !== "-1") {
          acc[item.id] = item.value
        } else {
          return null
        }
      }
      return acc
    }, {})

    if (data) {
      const newToken = await generateToken()
      const nameReactor = localStorage.getItem("reactor")
      data.reactor = nameReactor
      const response = await fetchCreateProduct(newToken, data)
      if (response) {
        modalForm.reset()
        modal.classList.toggle("show-modal")
        document.body.classList.toggle("show-modal")
      }
    }
  }

  modalForm.addEventListener("submit", createProduct)
}

const formattingHTMLData = (data) => {
  let template = ""
  data.forEach((item) => {
    const currentDate = new Date(item.updated_at)
    const formattingDate = new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    })
      .format(currentDate)
      .replace(".,", " - ")

    template += `<tr>
    <td><span class="circle ${item.status}"></span></td>
    <td>${item.name_product}</td>
    <td>${item.quant_produce}</td>
    <td>${item.num_op}</td>
    <td>${item.num_batch}</td>
    <td>${item.turn}</td>
    <td>${formattingDate}</td>
    <td>
    <a href="./analises.html" class="button-product" data-js="link-product-btn" data-name="${item.name_product}" data-id="${item.product_id}" data-status="${item.status}">
      <i class="fa-solid fa-circle-chevron-right" ></i>
    </a>
  </td>
  </tr>`
  })
  return template
}
export const renderProduct = async (data, product_status, token) => {
  const reactor = localStorage.getItem("reactor")
  const productList = document.querySelector(
    `[data-js='product-list-${product_status}-${reactor}']`,
  )
  buttonConfirm.classList.remove("btn-incomplete")

  if (data) {
    if (reactor === data[0].reactor) {
      const productListProgress = document.querySelector(
        `[data-js='product-list-andamento-${reactor}']`,
      )
      productListProgress.innerHTML = ""
      const formatData = formattingHTMLData(data)
      productList.innerHTML += formatData
    }
  }

  if (token) {
    const nameReactor = localStorage.getItem("reactor")
    const response = await fetchListProduct(token, nameReactor, null, product_status)
    if (response) {
      const { product_list: product } = response
      if (product_status === "andamento" && product.length > 0) {
        const formatData = formattingHTMLData(product)
        productList.innerHTML = formatData
      } else {
        const formatData = formattingHTMLData(product)
        productList.innerHTML = formatData
      }
    } else {
      localStorage.removeItem("access-token")
      window.location.reload()
    }
  }

  if (product_status === "andamento" && productList.children.length > 0) {
    buttonConfirm.classList.add("btn-incomplete")
  }
}
