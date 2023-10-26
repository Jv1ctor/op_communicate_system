import { Request, Response } from "express"
import { Users } from "@prisma/client"
import bcrypt from "bcrypt"
import prisma from "../database/prisma"
import RefreshToken from "../utils/refreshToken.utils"
import dayjs from "dayjs"

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
                message: "register success",
                user_profile: {
                  first_name: user.first_name,
                  last_name: user.last_name,
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
        include: { user_adm: true, user_cq: true, user_prod: true },
      })

      const correctPassword = user && (await bcrypt.compare(password, user.password))

      if (correctPassword) {
        const existRefreshToken = await prisma.refreshToken.findUnique({
          where: { fk_user_id: user.id },
          select: { id: true, expires_in: true },
        })

        const refreshToken = !existRefreshToken
          ? await RefreshToken.create(user.id)
          : existRefreshToken

        if (refreshToken) {
          const timestamp = dayjs.unix(refreshToken.expires_in).diff()
          return res
            .status(200)
            .cookie("refreshToken", refreshToken, {
              httpOnly: true,
              maxAge: timestamp,
              sameSite: "strict",
              secure: true,
            })
            .json({
              action: { login: true },
              message: "logging success",
              user_profile: {
                first_name: user.first_name,
                last_name: user.last_name,
                type_user:
                  (user.user_adm && "Admin") ||
                  (user.user_cq && "Controle Qualidade") ||
                  (user.user_prod && "Produção"),
              },
            })
        }
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
    const cookieRefreshToken = req.cookies.refreshToken
    if (cookieRefreshToken) {
      const refreshTokenId = cookieRefreshToken.id
      const existRefreshToken = await prisma.refreshToken.findUnique({
        where: { id: refreshTokenId },
      })
      if (existRefreshToken) {
        const token = await RefreshToken.generateToken(refreshTokenId)
        return res.status(200).json({ action: { refresh_token: true }, token: token })
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
    console.log(err)
    res.status(500).json({ error: "internal server error" })
  }
}

export const logout = async (_req: Request, res: Response) => {
  try {
    const userId = res.locals.userId
    res.clearCookie("refreshToken")
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { fk_user_id: userId },
    })
    if (refreshToken) {
      await prisma.refreshToken.delete({ where: { id: refreshToken.id } })
      return res.status(200).json({ action: { logout: true } })
    }
    res.status(200).json({ action: { logout: false }, error: "refresh token not exist" })
  } catch (err) {
    res.status(500).json({ error: "internal server error" })
  }
}

export const createReactors = async (req: Request, res: Response) => {
  try {
    const reactorName = req.body.name_reactor
    const userId = res.locals.userId
    if (reactorName) {
      const existReactor = await prisma.reactors.findUnique({
        where: { name_reactor: reactorName },
      })

      const reactor =
        !existReactor &&
        (await prisma.reactors.create({
          data: {
            name_reactor: reactorName,
            fk_user_adm: userId,
          },
        }))

      if (reactor) {
        return res.status(200).json({
          action: { reactors_created: true },
          message: "created reactor success",
          reactor: reactor.name_reactor,
        })
      }
      return res.status(400).json({
        action: { reactors_created: false },
        error: "reactor already exists",
      })
    }
    res.status(400).json({
      action: { reactors_created: false },
      error: "values not found",
    })
  } catch (err) {
    res.status(500).json({ error: "internal server error" })
  }
}

export const listReactors = () => {}
