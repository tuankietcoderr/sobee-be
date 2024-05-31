import { SOCKET_CLIENT_MESSAGE, SOCKET_SERVER_MESSAGE } from "@/common/constants/socket"
import handleSocketAPI from "@/common/helpers/handleSocketAPI"
import { BadRequestResponse, SuccessfulResponse } from "@/common/utils"
import { ChatRoom } from "@/models"
import { Socket } from "socket.io"

export function viewListRoomChat(socket: Socket) {
  handleSocketAPI({
    socket,
    clientEventName: SOCKET_CLIENT_MESSAGE.VIEW_LIST_ROOM_CHAT,
    middlewares: [],
    handler: async () => {
      const chatRooms = await ChatRoom.find({}).populate("customer.user staff.user order product").lean()
      const updateRooms = chatRooms.map((room) => {
        if (room.isHaveNew && room.lastMessage.sender.toString() == socket.data.userId) {
          room.isHaveNew = false
        }
        return room
      })

      return new SuccessfulResponse({ rooms: updateRooms }, 200, "Chat rooms").fromSocket(
        socket,
        SOCKET_SERVER_MESSAGE.LIST_ROOM_CHAT_RESULT
      )
    }
  })
}

export function viewRoomChat(socket: Socket) {
  handleSocketAPI({
    socket,
    clientEventName: SOCKET_CLIENT_MESSAGE.VIEW_ROOM_CHAT,
    middlewares: [],
    handler: async ({ chatRoomId }: { chatRoomId: string }) => {
      if (!chatRoomId) throw new BadRequestResponse("Chat room is required")

      const chatRoom = await ChatRoom.findById(chatRoomId).populate("customer.user staff.user order product")
      if (!chatRoom) throw new BadRequestResponse("Chat room not found")

      socket.join(`room-chat-${chatRoomId}`)

      return new SuccessfulResponse({ chatRoom }, 200, "Chat room").fromSocket(
        socket,
        SOCKET_SERVER_MESSAGE.VIEW_ROOM_CHAT_RESULT
      )
    }
  })
}

export function leaveRoomChat(socket: Socket) {
  handleSocketAPI({
    socket,
    clientEventName: SOCKET_CLIENT_MESSAGE.LEAVE_ROOM_CHAT,
    middlewares: [],
    handler: async ({ chatRoomId }: { chatRoomId: string }) => {
      if (!chatRoomId) throw new BadRequestResponse("Chat room is required")

      socket.leave(`room-chat-${chatRoomId}`)

      return new SuccessfulResponse({}, 200, "Leave chat room").fromSocket(
        socket,
        SOCKET_SERVER_MESSAGE.LEAVE_ROOM_CHAT_RESULT
      )
    }
  })
}
