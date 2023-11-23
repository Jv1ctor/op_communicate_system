import { fetchCreateProduct, fetchListProduct } from "../user/fetch.js"
import { generateToken, verifyGenerateToken } from "../user/token.js"
import { modal, modalForm } from "../config.js"

const productListProgress = document.querySelector("[data-js='product-list-andamento']")
const productListProgressArr = productListProgress?.children
const buttonConfirm = document.querySelector("[data-js='button-confirm']")

export const submitFormProduct = async () => {
  const token = await verifyGenerateToken()
  if (token) {
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

      if (data && productListProgressArr.length <= 0) {
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
}

const formattingHTMLData = (data) => {
  let template = ""
  data.forEach((item) => {
    const currentDate = new Date(item.created_at)
    const formattingDate = new Intl.DateTimeFormat("pt-BR").format(currentDate)

    template += `<tr>
    <td><span class="circle ${item.status}"></span></td>
    <td>${item.name_product}</td>
    <td>${item.quant_produce}</td>
    <td>${item.num_op}</td>
    <td>${item.num_batch}</td>
    <td>${item.turn}</td>
    <td>${formattingDate}</td>
    <td>
    <a href="./analises.html" class="button-product">
      <i class="fa-solid fa-circle-chevron-right" data-js="link-product-btn" data-name="${item.name_product}" data-id="${item.product_id}" data-status="${item.status}"></i>
    </a>
  </td>
  </tr>`
  })
  return template
}
export const renderProduct = async (data, product_status) => {
  const productList = document.querySelector(`[data-js='product-list-${product_status}']`)
  const productListProgressArr = productListProgress?.children
  productListProgress.innerHTML = ""
  if (productListProgressArr.length > 0) {
    buttonConfirm.classList.add("btn-incomplete")
  }
  if (data && productListProgressArr.length <= 0) {
    const formatData = formattingHTMLData(data)
    productList.innerHTML = formatData
  }

  const token = await verifyGenerateToken()
  if (token) {
    const nameReactor = localStorage.getItem("reactor")
    const response = await fetchListProduct(token, nameReactor, null, product_status)

    const { product_list: product } = response
    if (
      product_status === "andamento" &&
      product.length > 0 &&
      productListProgressArr.length <= 0
    ) {
      const formatData = formattingHTMLData(product)
      productList.innerHTML = formatData
    } else {
      const formatData = formattingHTMLData(product)
      productList.innerHTML = formatData
    }
  }
}
