import { Request, Response, NextFunction } from "express"
import JWT from "jsonwebtoken"
import dotenv from "dotenv"
import prisma from "../database/prisma"
dotenv.config()


const Auth = {
  async authenticate(req: Request, res: Response, next: NextFunction){
    const authCode = req.headers.authorization
    let success = false
    if(authCode){
      const [authType, token] = authCode.split(" ")
      if(authType === "Bearer"){
        try {
          const decoded = JWT.verify(token, process.env.JWT_KEY as string)
          const refreshToken = decoded && await prisma.refreshToken.findUnique({ where: { id: decoded.sub as string}})
          if(refreshToken){
            res.locals.userId = refreshToken.fk_user_id
            success = true
          }
        }catch(err) {}
      }        
    }
    if(success){
      next()
    }else{
      res.status(401).json({ error: "You are not authenticated or your session has expired"})
    }
  }
}

export default Auth