import handleSocketAPI from "@/common/helpers/handleSocketAPI"
import { BadRequestResponse, SuccessfulResponse } from "@/common/utils"
import { ERole } from "@/enum"
import { ChatRoom, User } from "@/models"
import { Socket } from "socket.io"
import userSocketList from "./userSocketList"
import { SOCKET_CLIENT_MESSAGE, SOCKET_SERVER_MESSAGE } from "@/common/constants/socket"

export default function createChatRoom(socket: Socket) {
  handleSocketAPI({
    socket,
    clientEventName: SOCKET_CLIENT_MESSAGE.CREATE_CHAT,
    middlewares: [],
    handler: async ({ userId, orderId, productId }: { userId: string; orderId?: string; productId?: string }) => {
      console.log("create-chat", { userId, orderId, productId })

      if (!userId) throw new BadRequestResponse("Members are required")

      const receiver = await User.findById(userId).lean()
      if (!receiver) throw new BadRequestResponse("User not found")

      const reqId = socket.data.userId
      const role = socket.data.role
      const customer = role === ERole.CUSTOMER ? reqId : userId
      const staff = role === ERole.STAFF ? reqId : userId

      const chatRoom = await ChatRoom.create({
        customer: { user: customer },
        staff: { user: staff },
        orderId,
        productId
      }).then((chatRoom) => chatRoom.populate("customer.user staff.user"))

      socket.join(`room-chat-${chatRoom._id}`)

      if (userSocketList.getSocket(userId)) {
        socket.to(userSocketList.getSocket(userId)).emit(SOCKET_SERVER_MESSAGE.NEW_CHAT_ROOM, { chatRoom })
      }

      return new SuccessfulResponse({ chatRoom }, 200, "Chat room created").fromSocket(
        socket,
        SOCKET_SERVER_MESSAGE.CREATE_CHAT_RESULT
      )
    }
  })
}
