import { NotificationService } from "@/controller"
import { ENotificationType } from "@/enum"
import { Socket } from "socket.io"

export default function getSocketRoutes(socket: Socket) {
    const notificationService = new NotificationService()

    socket.on("push-notification", (data) => {
        console.log(`User ${socket.id} pushed a notification`)
        notificationService.push(data)
    })

    socket.on("disconnect", () => {
        console.log(`User ${socket.id} disconnected`)
        socket.emit("push-notification", {
            type: ENotificationType.INFO,
            content: `User ${socket.id} disconnected`,
            redirectUrl: "http://localhost:3000",
            title: "User disconnected"
        })
    })
}
