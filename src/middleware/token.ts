import { Request, Response, NextFunction } from "express"
import dotenv from "dotenv"
import dayjs from "dayjs"
import RefreshToken from "../utils/refreshToken.utils"
import prisma from "../database/prisma"
dotenv.config()

const Token = {
  async create(req: Request, res: Response, next: NextFunction) {
    const refreshTokenCookie = req.signedCookies.refreshToken
    const accessTokenCookie = req.signedCookies.accessToken

    if (accessTokenCookie) {
      try {
        const accessToken = await prisma.accessToken.findUnique({ where: { refresh_token_id: refreshTokenCookie.id }})
  
        if(accessToken && accessToken.expires_in > dayjs().unix()){
          next()
          return
        }
      } catch (error) {
      }
    }
      const accessToken =
        refreshTokenCookie && (await RefreshToken.generateToken(refreshTokenCookie.id))
      if (accessToken) {
        const cookieAge = dayjs.unix(accessToken.expiresIn).diff()
        res.cookie("accessToken", accessToken.token, {
          httpOnly: true,
          sameSite: "strict",
          secure: true,
          maxAge: cookieAge,
          signed: true,
        })
      }
      next()
  },
}

export default Token
