import { IRoute } from "@/interface"
import { OrderService } from "./order.service"
import { Router } from "express"

export class OrderController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {}

    private static readonly orderService = new OrderService()

    constructor(path = "/api/order") {
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
