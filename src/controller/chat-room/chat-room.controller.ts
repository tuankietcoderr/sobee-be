import { IRoute } from "@/interface"
import { ChatRoomService } from "./chat-room.service"
import { Router } from "express"

export class ChatRoomController implements IRoute {
  private readonly router: Router
  private readonly path: string

  private readonly PATHS = {}

  private static readonly chatRoomService = new ChatRoomService()

  constructor(path = "/api/chat-room") {
    this.router = Router()
    this.path = path
    this.initializeRoutes()
  }

  private initializeRoutes(): void {}

  getPath(): string {
    return this.path
  }

  getRouter(): Router {
    return this.router
  }
}
