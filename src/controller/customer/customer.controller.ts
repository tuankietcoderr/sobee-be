import { IRoute } from "@/interface"
import { CustomerService } from "./customer.service"
import { Router } from "express"

export class CustomerController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {}

    private static readonly customerService = new CustomerService()

    constructor(path = "/api/customer") {
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
