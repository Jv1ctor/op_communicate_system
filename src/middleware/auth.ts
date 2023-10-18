import { Request, Response, NextFunction } from "express"
import JWT, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"
import prisma from "../database/prisma"
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
          if (refreshToken) {
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
}

export default Auth
