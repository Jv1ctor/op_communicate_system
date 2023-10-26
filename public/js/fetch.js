const BASIC_URL = "http://localhost:3000"

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

export const fetchReactorsList = async () => {}

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

    if (response.ok) {
      return response.json()
    }
  } catch (err) {
    throw new Error(err)
  }
}