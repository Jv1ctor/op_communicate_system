import { Request, Response } from "express"
import UserService, { UserLogin } from "../services/user.service"
import dayjs from "dayjs"
import RefreshToken from "../utils/refreshToken.utils"

interface CookieOption {
  httpOnly: boolean
  sameSite: "strict" | "lax" | "none"
  secure: boolean
  maxAge: number
  signed: boolean
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
        const accessToken = await RefreshToken.generateToken(userLogin.refreshToken.id)
        const expiresCookie = dayjs.unix(expiresIn).diff()
        const expiresInAccessTokenCookie =
          accessToken && dayjs.unix(accessToken.expiresIn).diff()

        const optionCookie: CookieOption = {
          httpOnly: true,
          sameSite: "strict",
          secure: true,
          maxAge: expiresCookie,
          signed: true,
        }

        res
          .cookie("refreshToken", userLogin.refreshToken, optionCookie)
          .cookie("accessToken", accessToken?.token, {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            maxAge: expiresInAccessTokenCookie,
            signed: true,
          })
          .cookie("user", userLogin.user, optionCookie)
        res.redirect("/")
        return
      }
      res.status(400).render("pages/login", {
        type_err: "Data_Err",
        error: "Usuário não existe ou senha errada",
      })
      return
    }
    res.status(400).render("pages/login", {
      type_err: "Fields_Err",
      error: 'Digite o nome do usuario nesse formato: "teste.teste"',
    })
  } catch (err) {
    res.status(500).render("pages/500", { err })
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshTokenId = req.signedCookies.refreshToken.id
    const refreshToken = await UserService.logoutUser(refreshTokenId)
    if (refreshToken) {
      res.clearCookie("refreshToken")
      res.clearCookie("accessToken")
      res.clearCookie("user")
      return res.redirect("/login")
    }
  } catch (err) {
    res.status(500).render("pages/500", { err })
  }
}
