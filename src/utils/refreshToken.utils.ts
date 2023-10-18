import JWT from "jsonwebtoken"
import dayjs from "dayjs"
import prisma from "../database/prisma"
import dotenv from "dotenv"
import { v4 as uuidv4 } from "uuid"
dotenv.config()

const RefreshToken = {
  async create(userId: string) {
    try {
      if (userId) {
        const expiresIn = dayjs().add(2, "second").unix()

        const refreshToken = await prisma.refreshToken.create({
          data: {
            expires_in: expiresIn,
            fk_user_id: userId,
          },
        })

        return refreshToken
      }
    } catch (err) {
      throw new Error(`error in create refresh token ${err}`)
    }
  },

  async generateToken(refreshTokenId: string) {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { id: refreshTokenId },
    })
    const tokenId = uuidv4()
    if (refreshToken) {
      const token = JWT.sign({}, process.env.JWT_KEY as string, {
        expiresIn: "24h",
        subject: refreshTokenId,
        jwtid: tokenId,
      })
      const decoded = token && JWT.decode(token, { json: true })

      if (decoded && decoded.jti && decoded.exp && decoded.sub) {
        const existAccessToken = await prisma.accessToken.findUnique({
          where: { refresh_token_id: decoded.sub },
        })
        if (existAccessToken) {
          await prisma.accessToken.delete({
            where: { refresh_token_id: decoded.sub },
          })
        }
        await prisma.accessToken.create({
          data: {
            id: decoded.jti,
            expires_in: decoded.exp,
            refresh_token_id: decoded.sub,
          },
        })
        return token
      }
    }
  },
}

export default RefreshToken