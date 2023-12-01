const productListProgress = document.querySelector("[data-js='product-list-andamento']")
const buttonConfirm = document.querySelector("[data-js='button-confirm']")

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
  const productList = document.querySelector(`[data-js='product-list-${product_status}']`)
  // buttonConfirm.classList.remove("btn-incomplete")
  const reactor = document.location.pathname.replace("/reator/", "")
  productListProgress.innerHTML = ""
  if (data && data.fk_reactor === reactor) {
    console.log("passow")
    const formatData = formattingHTMLData(data)
    productList.insertAdjacentHTML("afterbegin", formatData)
  }

  // if (product_status === "andamento" && productList.children.length > 0) {
  //   console.log("passow")
  //   buttonConfirm.classList.add("btn-incomplete")
  // }
}
