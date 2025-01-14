import { fetchToken } from "./fetch.js"

export const verifyGenerateToken = async () => {
  let token = ""
  if (!localStorage.getItem("access-token")) {
    const resRefreshToken = await fetchToken()
    if (resRefreshToken) {
      token = resRefreshToken.token
      localStorage.setItem("access-token", token)
    } else {
      localStorage.clear()
      window.location.replace("./login.html")
    }
  } else {
    token = localStorage.getItem("access-token")
  }

  return token
}

export const generateToken = async () => {
  const resRefreshToken = await fetchToken()
  if (resRefreshToken) {
    const token = resRefreshToken.token
    localStorage.setItem("access-token", token)

    return token
  } else {
    localStorage.clear()
    window.location.replace("./login.html")
  }
}
