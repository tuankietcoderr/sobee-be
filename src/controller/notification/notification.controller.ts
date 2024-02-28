import { IRoute } from "@/interface"
import { Request, Response, Router } from "express"
import { NotificationService } from "./notification.service"

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
        this.router.post("/push", this.push)
    }

    private async push(req: Request, res: Response) {
        try {
            await NotificationController.notificationService.push(req.body)
            res.status(200).send("Push notification successfully")
        } catch (error: any) {
            res.status(500).send(error.message)
        }
    }

    getPath(): string {
        return this.path
    }

    getRouter(): Router {
        return this.router
    }
}
