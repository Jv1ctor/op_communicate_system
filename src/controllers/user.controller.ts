import { Request, Response } from "express"
import { Users } from "@prisma/client"
import bcrypt from "bcrypt"
import prisma from "../database/prisma"
import RefreshToken from "../utils/refreshToken.utils"

interface UserRegistration extends Users {
  type_user: "production" | "quality_control"
}

interface UserLogin extends Users {
  name: string
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      first_name: firstName,
      last_name: lastName,
      password,
      type_user: typeUser,
    }: UserRegistration = req.body

    if (firstName && lastName && password && password.length >= 5 && typeUser) {
      const existUser = await prisma.users.findUnique({
        where: { last_name: lastName },
      })

      if (!existUser) {
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        const hashPassword = await bcrypt.hash(password, salt)
        let userTypeCreate = null

        if (typeUser === "production" || typeUser === "quality_control") {
          const user = await prisma.users.create({
            data: {
              first_name: firstName,
              last_name: lastName,
              password: hashPassword,
            },
          })

          if (typeUser === "production") {
            userTypeCreate = await prisma.userProd.create({
              data: { fk_id_user_prod: user.id },
            })
          }

          if (typeUser === "quality_control") {
            userTypeCreate = await prisma.userCq.create({
              data: { fk_id_user_cq: user.id },
            })
          }

          if (user && userTypeCreate) {
            const refreshToken = await RefreshToken.create(user.id)
            return (
              refreshToken &&
              res.status(201).json({
                action: { created_user: true, user_type: typeUser },
                refresh_token: {
                  id: refreshToken.id,
                  expires_in: refreshToken.expires_in,
                },
              })
            )
          }
        }
        return res.status(400).json({
          action: { created_user: false },
          error: "invalid credentials",
        })
      }
      return res.status(400).json({
        action: { created_user: false },
        error: "user already exists",
      })
    }
    res.status(400).json({
      action: { created_user: false },
      error: "values not found",
    })
  } catch (err) {
    res.status(500).json({ error: "internal server error" })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { name, password }: UserLogin = req.body
    const [firstName, lastName] = name.split(".")
    if (firstName && lastName && password) {
      const user = await prisma.users.findFirst({
        where: { first_name: firstName, last_name: lastName },
      })

      const correctPassword =
        user && (await bcrypt.compare(password, user.password))

      if (correctPassword) {
        const existRefreshToken = await prisma.refreshToken.findUnique({
          where: { fk_user_id: user.id },
          select: { id: true, expires_in: true },
        })

        const newRefreshToken =
          !existRefreshToken && (await RefreshToken.create(user.id))

        return res.status(200).json({
          action: { login: true },
          refresh_token: existRefreshToken ?? newRefreshToken,
        })
      }
      return res.status(400).json({
        action: { login: false },
        error: "invalid credentials or not exist",
      })
    }
    res.status(400).json({
      action: { login: false },
      error: "values not found",
    })
  } catch (err) {
    res.status(500).json({ error: "internal server error" })
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { id: refreshTokenId } = req.body
    if (refreshTokenId) {
      const existRefreshToken = await prisma.refreshToken.findUnique({
        where: { id: refreshTokenId },
      })
      if (existRefreshToken) {
        const token = await RefreshToken.generateToken(refreshTokenId)
        return res
          .status(200)
          .json({ action: { refresh_token: true }, token: token })
      }
      return res.status(400).json({
        action: { refresh_token: false },
        error: "refresh token invalid",
      })
    }
    res.status(400).json({
      action: { refresh_token: false },
      error: "values not found",
    })
  } catch (err) {
    res.status(500).json({ error: "internal server error" })
    console.log(err)
  }
}

export const profile = async (_req: Request, res: Response) => {
  try {
    const userId = res.locals.userId

    const profileUser = await prisma.users.findUnique({
      where: { id: userId },
      include: { user_adm: true, user_cq: true, user_prod: true },
    })
    console.log(profileUser)
    if (profileUser) {
      const typeUser =
        (profileUser.user_adm && "admin") ??
        (profileUser.user_cq && "quality") ??
        (profileUser.user_prod && "production")
      return res.status(200).json({
        action: { profile: true },
        profile_user: {
          first_name: profileUser.first_name,
          last_name: profileUser.last_name,
          type_user: typeUser,
        },
      })
    }
    res
      .status(400)
      .json({ action: { profile: false }, error: "user not found" })
  } catch (err) {
    res.status(500).json({ error: "internal server error" })
  }
}

export const logout = async (_req: Request, res: Response) => {
  try {
    const userId = res.locals.userId
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { fk_user_id: userId },
    })
    if (refreshToken) {
      await prisma.refreshToken.delete({ where: { id: refreshToken.id } })
      return res.status(200).json({ action: { logout: true } })
    }
    res
      .status(200)
      .json({ action: { logout: false }, error: "refresh token not exist" })
  } catch (err) {
    res.status(500).json({ error: "internal server error" })
  }
}
