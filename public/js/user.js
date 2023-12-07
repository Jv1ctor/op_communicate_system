const userType = document.querySelector("[data-js='type-user']")

sessionStorage.setItem("type-user", userType.textContent)
