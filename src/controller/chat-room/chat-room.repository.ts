import { IChatRoom } from "@/interface"
import { CreateChatRoomRequest, CreateChatRoomResponse } from "./dto"

export abstract class ChatRoomRepository {
  abstract create(req: CreateChatRoomRequest): Promise<CreateChatRoomResponse>
  abstract delete(id: string): Promise<IChatRoom>
  abstract getRoomById(id: string): Promise<IChatRoom>
  abstract getRoomsByUser(userId: string): Promise<IChatRoom[]>
  abstract getAll(): Promise<IChatRoom[]>
}
