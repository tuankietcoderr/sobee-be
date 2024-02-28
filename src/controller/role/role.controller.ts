import { IRoute } from "@/interface"
import { RoleService } from "./role.service"
import { Router } from "express"

export class RoleController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {}

    private static readonly roleService = new RoleService()

    constructor(path = "/api/role") {
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
