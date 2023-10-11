import dayjs from "dayjs"
import prisma from "../database/prisma"

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
}

export default RefreshToken
