const basicUrl = "http://localhost:3000"

export const fetchLogin = async (name, password) => {
  try {
    const response = await fetch(`${basicUrl}/api/user/login`, {
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
    console.log(response)
    return response.json()
  } catch (err) {
    throw new Error(err)
  }
}
