import { IRoute } from "@/interface"
import { StaffService } from "./staff.service"
import { Router } from "express"

export class StaffController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {}

    private static readonly staffService = new StaffService()

    constructor(path = "/api/staff") {
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
