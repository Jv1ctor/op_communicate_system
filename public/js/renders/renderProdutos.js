import { fetchCreateProduct, fetchListProduct, fetchReactorsList } from "../user/fetch.js"
import { generateToken, verifyGenerateToken } from "../user/token.js"
import { modal, modalForm } from "../modal.js"

const productList = document.querySelector("[data-js='product-list']")
const productListArr = productList?.children

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

      if (data && productListArr.length <= 0) {
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
    return
  }
}

const formattingHTMLData = (data) => {
  const currentDate = new Date(data.created_at)
  const formattingDate = new Intl.DateTimeFormat("pt-BR").format(currentDate)

  return `<tr>
  <td><span class="circle"></span></td>
  <td>${data.name_product}</td>
  <td>${data.quant_produce}</td>
  <td>${data.num_op}</td>
  <td>${data.num_batch}</td>
  <td>${data.turn}</td>
  <td>${formattingDate}</td>
  <td>
  <a href="./analises.html" class="button-product">
    <i class="fa-solid fa-circle-chevron-right"></i>
  </a>
</td>
</tr>`
}

export const renderProduct = async (data) => {
  if (data && productListArr.length <= 0) {
    const formatData = formattingHTMLData(data)
    productList.innerHTML = formatData
  }

  if (productListArr.length <= 0) {
    const token = await verifyGenerateToken()
    if (token) {
      const nameReactor = localStorage.getItem("reactor")
      const response = await fetchListProduct(token, nameReactor)

      const { product_list: product } = response
      if (product.length > 0) {
        const formatData = formattingHTMLData(product[0])
        productList.innerHTML = formatData
      }
    }
  }
}
