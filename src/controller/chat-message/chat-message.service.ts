import { IChatMessage } from "@/interface"
import { ChatMessageRepository } from "./chat-message.repository"
import { ChatMessage } from "@/models"
import { ObjectModelNotFoundException } from "@/common/exceptions"

export class ChatMessageService implements ChatMessageRepository {
  async create(req: IChatMessage): Promise<IChatMessage> {
    return await ChatMessage.create(req)
  }
  async delete(id: string): Promise<IChatMessage> {
    const deleted = await ChatMessage.findByIdAndDelete(id)
    if (!deleted) throw new ObjectModelNotFoundException()
    return deleted
  }
}
