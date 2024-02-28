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

configDotenv()

async function runHttpServer() {
    const HTTP_PORT = process.env.PORT || 3000
    httpServer.listen(HTTP_PORT, () => {
        console.log(`Server is running on port ${HTTP_PORT}`)
    })
}

async function runSocketServer() {
    io.use((socket, next) => {
        const token = (socket.handshake.query.token as string) ?? ""
        const role = (socket.handshake.query.role as ERole) ?? ""

        if (!role) return next()

        switch (role) {
            case ERole.CUSTOMER: {
                const decoded = verifyToken(token) as JwtPayload
                socket.data.userId = decoded.userId
                break
            }
            default:
                return next(new Error("Invalid role"))
        }

        next()
    })
    return new Promise((resolve, reject) => {
        io.on("connection", async (socket) => {
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
