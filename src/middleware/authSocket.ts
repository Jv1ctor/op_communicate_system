import JWT, { JwtPayload } from "jsonwebtoken"
import { Socket } from "socket.io"
import { ExtendedError } from "socket.io/dist/namespace"

type NextSokect = (err?: ExtendedError | undefined) => void

const AuthSocket = {
  async authorization(socket: Socket, next: NextSokect) {
    const token = socket.handshake.auth.token

    if (token) {
      const decoded = JWT.verify(token, process.env.JWT_KEY as string) as JwtPayload
      console.log(decoded.sub)
    }
  },
}

export default AuthSocket
