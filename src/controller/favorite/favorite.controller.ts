import { IRoute } from "@/interface"
import { FavoriteService } from "./favorite.service"
import { Router } from "express"

export class FavoriteController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {}

    private static readonly favoriteService = new FavoriteService()

    constructor(path = "/api/favorite") {
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
