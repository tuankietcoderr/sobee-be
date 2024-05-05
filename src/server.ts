import { configDotenv } from "dotenv"
import "module-alias/register"
import { connectDB } from "./common/utils/db"
import app from "./config/app"
import httpServer from "./config/http-server"
import getRoutes from "./routes"
import io from "./config/socket-server"
import getSocketRoutes from "./routes/socket"
import { ERole } from "./enum"
import { verifyToken } from "./common/utils"
import { JwtPayload } from "jsonwebtoken"
import { IKeyToken } from "./interface"
import KeyToken from "./models/KeyToken"
import { SOCKET_SERVER_MESSAGE } from "./common/constants/socket"

configDotenv()

async function runHttpServer() {
    const HTTP_PORT = process.env.PORT || 3000
    httpServer.listen(HTTP_PORT, () => {
        console.log(`Server is running on port ${HTTP_PORT}`)
    })
}

async function runSocketServer() {
    io.use(async (socket, next) => {
        const accessToken = (socket.handshake.headers.token as string) ?? ""
        const clientId = (socket.handshake.headers.client as string) ?? ""

        if (!accessToken || !clientId) return next(new Error("Authentication error!"))

        const keyToken = await KeyToken.findOne({ user: clientId }).lean()

        if (!keyToken) return next(new Error("Authentication error!"))

        const decoded = verifyToken(accessToken, keyToken.publicKey) as JwtPayload

        socket.data.userId = decoded.userId
        socket.data.role = decoded.role
        socket.data.keyToken = keyToken as IKeyToken

        next()
    })
    return new Promise((resolve, reject) => {
        io.on(SOCKET_SERVER_MESSAGE.CONNECTION, async (socket) => {
            console.log("Socket connected: ", socket.id)

            getSocketRoutes(socket)
        })
        resolve("Socket server is running")
    })
}

async function start() {
    await connectDB()
    const message = await runSocketServer()
    console.log(message)
    await runHttpServer()
    getRoutes(app)
}

start()
