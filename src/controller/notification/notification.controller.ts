import { IRoute } from "@/interface"
import { Request, Response, Router } from "express"
import { NotificationService } from "./notification.service"
import { asyncHandler } from "@/common/utils"

export class NotificationController implements IRoute {
  private router: Router
  private path: string
  private readonly PATHS = {}

  private static readonly notificationService = new NotificationService()

  constructor(path = "/api/notification") {
    this.router = Router()
    this.path = path
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.post("/push", asyncHandler(this.push))
  }

  private async push(req: Request, res: Response) {
    await NotificationController.notificationService.push(req.body)
    res.status(200).send("Push notification successfully")
  }

  getPath(): string {
    return this.path
  }

  getRouter(): Router {
    return this.router
  }
}
