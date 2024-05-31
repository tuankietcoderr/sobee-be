import { IChatRoom } from "@/interface"
import { ChatRoomRepository } from "./chat-room.repository"
import { ChatRoom } from "@/models"
import { ObjectModelNotFoundException } from "@/common/exceptions"

export class ChatRoomService implements ChatRoomRepository {
  async create(req: IChatRoom): Promise<IChatRoom> {
    return await ChatRoom.create(req)
  }
  async delete(id: string): Promise<IChatRoom> {
    const deleted = await ChatRoom.findByIdAndDelete(id)
    if (!deleted) throw new ObjectModelNotFoundException()
    return deleted
  }
  async getRoomById(id: string): Promise<IChatRoom> {
    const room = await ChatRoom.findById(id).populate("customer.user staff.user order product")
    if (!room) throw new ObjectModelNotFoundException()
    return room
  }
  async getRoomsByUser(userId: string): Promise<IChatRoom[]> {
    const rooms = await ChatRoom.find({
      $or: [{ "customer.user": userId }, { "staff.user": userId }]
    }).populate("customer.user staff.user order product")

    const updateRooms = rooms.map((room) => {
      if (room.isHaveNew && room.lastMessage.sender.toString() == userId) {
        room.isHaveNew = false
      }
      return room
    })

    return updateRooms
  }
  async getAll(): Promise<IChatRoom[]> {
    const rooms = await ChatRoom.find().populate("customer.user staff.user order product").lean()
    return rooms
  }
}
