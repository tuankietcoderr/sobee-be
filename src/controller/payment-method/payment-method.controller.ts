import { IRoute } from "@/interface"
import { PaymentMethodService } from "./payment-method.service"
import { Router } from "express"

export class PaymentMethodController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {}

    private static readonly paymentMethodService = new PaymentMethodService()

    constructor(path = "/api/payment-method") {
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
