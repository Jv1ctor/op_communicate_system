import { Request, Response, NextFunction } from "express"
import JWT, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"
import prisma from "../database/prisma"
import RefreshToken from "../utils/refreshToken.utils"
dotenv.config()

const Auth = {
  async authenticate(req: Request, res: Response, next: NextFunction) {
    let success = false
    const accessToken = req.signedCookies.accessToken
    const refreshTokenCookie = req.signedCookies.refreshToken
    if (accessToken && refreshTokenCookie) {
      try {
        const decoded = JWT.verify(
          accessToken,
          process.env.JWT_KEY as string,
        ) as JwtPayload

        const refreshToken =
          decoded &&
          (await prisma.refreshToken.findUnique({
            where: { id: decoded.sub as string },
            include: { access_token: { where: { id: decoded.jti } } },
          }))

        if (refreshToken) {
          if (refreshToken.id && refreshToken.access_token) {
            res.locals.userId = refreshToken.fk_user_id
            success = true
          }
        }
      } catch (err) {}
    } else {
      res.redirect("/")
      return
    }

    if (success) {
      next()
    } else {
      res.status(401).redirect("/login")
    }
  },

  authorization(permiss: "admin" | "quality" | "production") {
    return async (_req: Request, res: Response, next: NextFunction) => {
      const userId = res.locals.userId
      let success = false
      if (userId) {
        try {
          const user = await prisma.users.findUnique({
            where: { id: userId },
            include: { user_adm: true, user_cq: true, user_prod: true },
          })

          const typeUser = {
            admin: user?.user_adm,
            quality: user?.user_cq,
            production: user?.user_prod,
          }

          if (typeUser[permiss]) {
            success = true
          }
        } catch (err) {}
      }

      if (success) {
        next()
      } else {
        res.status(401).json({
          error: "You are not authorization",
        })
      }
    }
  },

  Logged(req: Request, res: Response, next: NextFunction) {
    const cookie = req.signedCookies.refreshToken
    if (cookie) {
      next()
    } else {
      res.status(401).redirect("/login")
    }
  },

  async validRefreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken
      if (refreshToken) {
        const valid = await RefreshToken.isValidRefreshToken(refreshToken.id)
        if (!valid) {
          res.clearCookie("refreshToken")
        }
      }
      next()
    } catch (err) {
      res.status(401).json({ error: "refresh token expired" })
    }
  },
}

export default Auth
