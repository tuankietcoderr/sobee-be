import handleSocketAPI from "@/common/helpers/handleSocketAPI"
import { BadRequestResponse, SuccessfulResponse } from "@/common/utils"
import { Socket } from "socket.io"

export default function sendChatMessage(socket: Socket) {
    handleSocketAPI({
        socket,
        clientEventName: "send-msg",
        middlewares: [],
        handler: async ({ content, receiver }: { receiver: string; content: string }) => {
            if (!content) throw new BadRequestResponse("Content is required")
            if (!receiver) throw new BadRequestResponse("Receiver is required")

            socket.to(receiver).emit("receive-msg", { content, sender: socket.id })

            return new SuccessfulResponse({ content, sender: socket.id }, 200, "Message sent").fromSocket(socket)
        }
    })
}
