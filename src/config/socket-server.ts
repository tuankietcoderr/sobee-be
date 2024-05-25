import { Server } from "socket.io"
import server from "./http-server"

const io = new Server(server, {
  maxHttpBufferSize: 1e8,
  path: "/socket"
})

export default io
