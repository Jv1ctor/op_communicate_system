import { Request, Response } from "express"

export const pong = (_req: Request, res: Response) => {
  res.json({ pong: true })
}
