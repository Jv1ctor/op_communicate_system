import config from "../config.js"

const { BASIC_URL } = config

export const fetchLogin = async (name, password) => {
  try {
    const response = await fetch(`${BASIC_URL}/api/user/login`, {
      method: "POST",
      body: JSON.stringify({
        name: String(name).trim(),
        password: String(password).trim(),
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    return response.json()
  } catch (err) {
    throw new Error(err)
  }
}

export const fetchLogout = async (token) => {
  try {
    const response = await fetch(`${BASIC_URL}/api/user/logout-user`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    return response.json()
  } catch (err) {
    throw new Error(err)
  }
}

export const fetchReactorsList = async (token) => {
  try {
    const response = await fetch(`${BASIC_URL}/api/user/list-reactors`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status == "200") {
      return response.json()
    }
  } catch (err) {
    throw new Error(err)
  }
}

export const fetchToken = async () => {
  try {
    const response = await fetch(`${BASIC_URL}/api/user/refresh-token`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (response.status == 200) {
      return response.json()
    }
  } catch (err) {
    throw new Error(err)
  }
}

export const fetchCreateProduct = async (token, data) => {
  try {
    const response = await fetch(`${BASIC_URL}/api/events/create-product`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (response.status == "201") {
      return response.json()
    }
  } catch (err) {
    throw new Error(err)
  }
}

export const fetchListProduct = async (token, reactor, productId) => {
  try {
    const response = await fetch(`${BASIC_URL}/api/events/list-product`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        reactor: reactor,
        product_id: productId,
      },
    })

    if (response.status == "200") {
      return response.json()
    }
  } catch (err) {
    throw new Error(err)
  }
}

export const fetchCreateAnalysis = async (token, data) => {
  try {
    const response = await fetch(`${BASIC_URL}/api/events/create-analysis`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (response.status == "201") {
      return response.json()
    }
  } catch (err) {
    throw new Error(err)
  }
}

export const fetchListAnalysis = async (token, product) => {
  try {
    const response = await fetch(`${BASIC_URL}/api/events/list-analysis`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        product: product,
      },
    })

    if (response.status == "200") {
      return response.json()
    }
  } catch (err) {
    throw new Error(err)
  }
}
