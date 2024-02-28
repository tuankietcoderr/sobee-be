import { IRoute } from "@/interface"
import { UserService } from "./user.service"
import { Router } from "express"

export class UserController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {}

    private static readonly userService = new UserService()

    constructor(path = "/api/user") {
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
