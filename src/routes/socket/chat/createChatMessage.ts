import { SOCKET_CLIENT_MESSAGE, SOCKET_SERVER_MESSAGE } from "@/common/constants/socket"
import handleSocketAPI from "@/common/helpers/handleSocketAPI"
import { BadRequestResponse, SuccessfulResponse } from "@/common/utils"
import { IChatMessage } from "@/interface"
import { ChatRoom } from "@/models"
import { Socket } from "socket.io"

export default function createChatMessage(socket: Socket) {
  handleSocketAPI({
    socket,
    clientEventName: SOCKET_CLIENT_MESSAGE.CREATE_CHAT_MESSAGE,
    middlewares: [],
    handler: async ({ chatRoomId, message }: { chatRoomId: string; message: IChatMessage }) => {
      if (!chatRoomId || !message) throw new BadRequestResponse("Chat room and message are required")

      const chatRoom = await ChatRoom.findById(chatRoomId)
      if (!chatRoom) throw new BadRequestResponse("Chat room not found")

      const customer = chatRoom.customer.user.toString()
      const staff = chatRoom.staff.user.toString()

      message.sender = socket.data.userId === customer ? customer : staff
      message.receiver = socket.data.userId === customer ? staff : customer

      message.createdAt = new Date()
      message.updatedAt = new Date()

      chatRoom.lastMessage = message

      chatRoom.messages.push(message)
      chatRoom.isHaveNew = true
      await chatRoom.save()

      socket.in(`room-chat-${chatRoomId}`).emit(SOCKET_SERVER_MESSAGE.NEW_CHAT_MESSAGE, {
        chatRoomId,
        message: chatRoom.messages[chatRoom.messages.length - 1]
      })

      return new SuccessfulResponse(
        { chatRoomId, message: chatRoom.messages[chatRoom.messages.length - 1] },
        200,
        "Chat message created"
      ).fromSocket(socket, SOCKET_SERVER_MESSAGE.CREATE_CHAT_MESSAGE_RESULT)
    }
  })
}
