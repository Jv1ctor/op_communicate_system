import JWT from "jsonwebtoken"
import dayjs from "dayjs"
import prisma from "../database/prisma"
import dotenv from "dotenv"

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

  generateToken(refreshTokenId: string, userId: string) {
    const token = JWT.sign({}, process.env.JWT_KEY as string, {
      expiresIn: "24h",
      subject: userId,
      issuer: refreshTokenId,
    })

    return token
  },
}

export default RefreshToken
