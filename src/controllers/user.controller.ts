import { Request, Response } from "express"
import UserService, { UserLogin, UserRegistration } from "../services/users.service"
import dayjs from "dayjs"

export const createUser = async (req: Request, res: Response) => {
  try {
    const dataRegistration: UserRegistration = req.body
    const validationExist =
      (dataRegistration.first_name &&
        dataRegistration.last_name &&
        dataRegistration.password &&
        dataRegistration.password.length >= 5 &&
        dataRegistration.type_user &&
        dataRegistration.type_user === "production") ||
      dataRegistration.type_user === "quality_control"

    if (validationExist) {
      const userRegistration = await UserService.registerUser(dataRegistration)
      if (userRegistration) {
        return res.status(201).json({
          action: { created_user: true, user_type: userRegistration.user.type_user },
          message: "register success",
          user_profile: {
            first_name: userRegistration.user.first_name,
            last_name: userRegistration.user.last_name,
          },
        })
      }
      return res.status(400).json({
        action: { created_user: false },
        error: "user already exists",
      })
    }
    return res.status(400).json({
      action: { created_user: false },
      error: "invalid credentials",
    })
  } catch (err) {
    res.status(500).json({ error: "internal server error" })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { name, password }: UserLogin = req.body
    const [firstName, lastName] = name.split(".")
    if (firstName && lastName && password) {
      const dataLogin = {
        name: name,
        first_name: firstName,
        last_name: lastName,
        password: password,
      }

      const userLogin = await UserService.loginUser(dataLogin)
      if (userLogin) {
        const expiresIn = userLogin.refreshToken.expires_in
        const expiresCookie = dayjs.unix(expiresIn).diff()

        return res
          .status(200)
          .cookie("refreshToken", userLogin.refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            maxAge: expiresCookie,
          })
          .json({
            action: { login: true },
            message: "logging success",
            user_profile: {
              first_name: userLogin.user.first_name,
              last_name: userLogin.user.last_name,
              type_user: userLogin.user.type_user,
            },
          })
      }
      return res.status(400).json({
        action: { login: false },
        error: "invalid credentials or not exist",
      })
    }
    res.status(400).json({
      action: { login: false },
      error: "values not found",
    })
  } catch (err) {
    res.status(500).json({ error: "internal server error" })
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const cookieRefreshToken = req.cookies.refreshToken
    if (cookieRefreshToken) {
      const token = await UserService.refreshTokenUser(cookieRefreshToken)
      if (token) {
        return res.status(200).json({ action: { refresh_token: true }, token: token })
      }
      return res.status(400).json({
        action: { refresh_token: false },
        error: "refresh token invalid",
      })
    }
    res.status(400).json({
      action: { refresh_token: false },
      error: "values not found",
    })
  } catch (err) {
    res.status(500).json({ error: "internal server error" })
  }
}

export const logout = async (_req: Request, res: Response) => {
  try {
    const userId = res.locals.userId
    res.clearCookie("refreshToken")
    const refreshToken = await UserService.logoutUser(userId)
    if (refreshToken) {
      return res.status(200).json({ action: { logout: true } })
    }
    res.status(200).json({ action: { logout: false }, error: "refresh token not exist" })
  } catch (err) {
    res.status(500).json({ error: "internal server error" })
  }
}
