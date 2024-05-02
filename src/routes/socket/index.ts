import { SOCKET_CLIENT_MESSAGE } from "@/common/constants/socket"
import { socketAsyncHandler } from "@/common/helpers/socketAsyncHandler"
import { BadRequestResponse, SuccessfulResponse } from "@/common/utils"
import { NotificationService } from "@/controller"
import { ENotificationType } from "@/enum"
import { Socket } from "socket.io"
import sendChatMessage from "./chat/sendChatMessage"

export default function getSocketRoutes(socket: Socket) {
    sendChatMessage(socket)

    const notificationService = new NotificationService()

    socket.on("push-notification", (data) => {
        console.log(`User ${socket.id} pushed a notification`)
        notificationService.push(data)
    })

    //ping test route for testing connection between client and server socket
    socket.on(
        SOCKET_CLIENT_MESSAGE.PING,
        socketAsyncHandler({
            socket,
            serverEvent: async (data: { text: string }) => {
                if (data.text !== "OK") throw new BadRequestResponse("Text is not OK")
                return new SuccessfulResponse({ text: "Pong", user: socket.data }, 200, "Connection is ok").fromSocket(
                    socket,
                    "pong"
                )
            }
        })
    )

    socket.on(SOCKET_CLIENT_MESSAGE.DISCONNECT, () => {
        console.log(`User ${socket.id} disconnected`)
        socket.emit("push-notification", {
            type: ENotificationType.INFO,
            content: `User ${socket.id} disconnected`,
            redirectUrl: "http://localhost:3000",
            title: "User disconnected"
        })
    })
}
