import { Socket } from "socket.io"
import createChatRoom from "./createChatRoom"
import createChatMessage from "./createChatMessage"
import { viewListRoomChat, viewRoomChat } from "./viewChat"

export default function handleChat(socket: Socket) {
  createChatRoom(socket)
  createChatMessage(socket)
  viewListRoomChat(socket)
  viewRoomChat(socket)
}
