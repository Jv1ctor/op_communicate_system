import prisma from "../database/prisma"
import bcrypt from "bcrypt"
import { Users, RefreshToken as RefreshTokenType } from "@prisma/client"
import RefreshToken from "../utils/refreshToken.utils"

export interface UserRegistration extends Users {
  type_user: "production" | "quality_control"
}

export type UserLogin = {
  name: string
  first_name: string
  last_name: string
  password: string
}

const generateHashPassword = async (password: string) => {
  const saltRounds = 10
  const salt = await bcrypt.genSalt(saltRounds)
  const hashPassword = bcrypt.hash(password, salt)

  return hashPassword
}

const UserService = {
  async registerUser(data: UserRegistration) {
    try {
      const existUser = await prisma.users.findUnique({
        where: { last_name: data.last_name },
      })

      if (!existUser) {
        const hashPassword = await generateHashPassword(data.password)
        let userTypeCreate = null

        const user = await prisma.users.create({
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
            password: hashPassword,
          },
        })

        if (data.type_user === "production") {
          userTypeCreate = await prisma.userProd.create({
            data: { fk_id_user_prod: user.id },
          })
        }

        if (data.type_user === "quality_control") {
          userTypeCreate = await prisma.userCq.create({
            data: { fk_id_user_cq: user.id },
          })
        }

        if (user && userTypeCreate) {
          const refreshToken = await RefreshToken.create(user.id)
          return (
            refreshToken && {
              user: {
                first_name: user.first_name,
                last_name: user.last_name,
                type_user: data.type_user,
              },
            }
          )
        }
      }
    } catch (err) {
      throw new Error("resgiter user error")
    }
  },

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
              first_name: user.first_name,
              last_name: user.last_name,
              type_user:
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

  async refreshTokenUser(cookieRefreshToken: RefreshTokenType) {
    try {
      const refreshTokenId = cookieRefreshToken.id
      const existRefreshToken = await prisma.refreshToken.findUnique({
        where: { id: refreshTokenId },
      })
      if (existRefreshToken) {
        const token = await RefreshToken.generateToken(refreshTokenId)
        return token
      }
    } catch (err) {
      throw new Error("token error")
    }
  },

  async logoutUser(userId: string) {
    try {
      const refreshToken = await prisma.refreshToken.findUnique({
        where: { fk_user_id: userId },
      })
      if (refreshToken) {
        await prisma.refreshToken.delete({ where: { id: refreshToken.id } })
        return refreshToken
      }
    } catch (err) {
      throw new Error("logout user error")
    }
  },
}

export default UserService
