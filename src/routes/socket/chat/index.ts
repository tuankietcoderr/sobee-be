import { Socket } from "socket.io"
import createChatRoom from "./createChatRoom"
import createChatMessage from "./createChatMessage"
import sendChatMessage from "./sendChatMessage"
import { viewListRoomChat, viewRoomChat } from "./viewChat"

export default function handleChat(socket: Socket) {
  createChatRoom(socket)
  createChatMessage(socket)
  sendChatMessage(socket)
  viewListRoomChat(socket)
  viewRoomChat(socket)
}
