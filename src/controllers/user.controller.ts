import { Request, Response } from "express"
import { Users } from "@prisma/client"
import bcrypt from "bcrypt"
import prisma from "../database/prisma"
import RefreshToken from "../utils/refreshToken.utils"

interface UserRegistration extends Users {
  type_user: "production" | "quality_control"
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
          return res.status(201).json({
            action: { created_user: true, user_type: typeUser },
            refreshToken,
          })
        }
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
