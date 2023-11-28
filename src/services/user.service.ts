import prisma from "../database/prisma"
import bcrypt from "bcrypt"
import RefreshToken from "../utils/refreshToken.utils"

export type UserLogin = {
  name: string
  first_name: string
  last_name: string
  password: string
}

const UserService = {
  async loginUser(data: UserLogin) {
    try {
      const user = await prisma.users.findFirst({
        where: { first_name: data.first_name, last_name: data.last_name },
        include: { user_adm: true, user_cq: true, user_prod: true },
      })

      const correctPassword = user && (await bcrypt.compare(data.password, user.password))

      if (correctPassword) {
        const existRefreshToken = await prisma.refreshToken.findUnique({
          where: { fk_user_id: user.id },
          select: { id: true, expires_in: true },
        })

        const isValid =
          existRefreshToken &&
          (await RefreshToken.isValidRefreshToken(existRefreshToken.id))

        const refreshToken =
          !existRefreshToken || !isValid
            ? await RefreshToken.create(user.id)
            : existRefreshToken

        if (refreshToken) {
          return {
            refreshToken: refreshToken,
            user: {
              name: `${user.first_name} ${user.last_name}`,
              type:
                (user.user_adm && "Admin") ||
                (user.user_cq && "Controle Qualidade") ||
                (user.user_prod && "Produção"),
            },
          }
        }
      }
    } catch (err) {
      throw new Error("login user error")
    }
  },

  async logoutUser(refreshTokenId: string) {
    try {
      if (refreshTokenId) {
        const refreshToken = await prisma.refreshToken.delete({
          where: { id: refreshTokenId },
        })
        return refreshToken
      }
    } catch (err) {
      throw new Error("logout user error")
    }
  },
}

export default UserService
