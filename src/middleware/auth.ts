import { Request, Response, NextFunction } from "express"
import JWT, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"
import prisma from "../database/prisma"
import RefreshToken from "../utils/refreshToken.utils"
dotenv.config()

const Auth = {
  async authenticate(req: Request, res: Response, next: NextFunction) {
    const authCode = req.headers.authorization
    let success = false
    if (authCode) {
      const [authType, token] = authCode.split(" ")
      if (authType === "Bearer") {
        try {
          const decoded = JWT.verify(
            token,
            process.env.JWT_KEY as string,
          ) as JwtPayload
          const refreshToken =
            decoded &&
            (await prisma.refreshToken.findUnique({
              where: { id: decoded.sub as string },
            }))
          const validRefreshToken = await RefreshToken.isValidRefreshToken(
            refreshToken?.id,
          )
          if (refreshToken && validRefreshToken) {
            const acessTokenValid = await prisma.accessToken.findUnique({
              where: {
                refresh_token_id: refreshToken.id,
                id: decoded.jti,
              },
            })

            if (acessTokenValid) {
              res.locals.userId = refreshToken.fk_user_id
              success = true
            } else {
              return res.status(401).json({ error: "invalid access token" })
            }
          }
        } catch (err) {}
      }
    }
    if (success) {
      next()
    } else {
      res.status(401).json({
        error: "You are not authenticated or your session has expired",
      })
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
          if (permiss === "admin" && user && user.user_adm) {
            success = true
          }
          if (permiss === "production" && user && user.user_prod) {
            success = true
          }
          if (permiss === "quality" && user && user.user_cq) {
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

  notExistCookie(req: Request, res: Response, next: NextFunction) {
    const cookie = req.cookies.refreshToken

    if (cookie) {
      res.status(401).json({ error: "you are already logged in" })
    } else {
      next()
    }
  },
}

export default Auth
