import { runSubmitForm } from "../forms/submitForm.js"
import { buttonConfirm } from "../config.js"
const productListProgress = document.querySelector(
  "[data-js='product-list-andamento']"
)

const formattingHTMLData = (data) => {
  const currentDate = new Date(data.updated_at)
  const formattingDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(currentDate)
    .replace(", ", "-")

  let template = `<tr>
    <td><span class="circle ${data.status}"></span></td>
    <td>${data.name_product}</td>
    <td>${data.quant_produce}</td>
    <td>${data.num_op}</td>
    <td>${data.num_batch}</td>
    <td>${data.turn}</td>
    <td>${formattingDate}</td>
    <td>
    <a href="/reator/produto/${data.fk_reactor}.${data.product_id}" class="button-product">
      <i class="fa-solid fa-circle-chevron-right" data-js="link-product-btn"></i>
    </a>
  </td>
  </tr>`

  return template
}
export const renderProduct = async (data, product_status) => {
  const productList =
    product_status &&
    document.querySelector(`[data-js='product-list-${product_status}']`)
  // buttonConfirm.classList.remove("btn-incomplete")
  const reactor = document.location.pathname.replace("/reator/", "")
  if (data && data.fk_reactor === reactor) {
    productListProgress.innerHTML = ""
    const formatData = formattingHTMLData(data)
    productList.insertAdjacentHTML("afterbegin", formatData)
  }

  if (productListProgress.children.length > 0) {
    buttonConfirm.classList.add("btn-incomplete")
  } else {
    buttonConfirm.classList.remove("btn-incomplete")
  }

  runSubmitForm()
}
