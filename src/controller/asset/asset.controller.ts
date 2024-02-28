import { IRoute } from "@/interface"
import { AssetService } from "./asset.service"
import { Router } from "express"

export class AssetController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {}

    private static readonly assetService = new AssetService()

    constructor(path = "/api/asset") {
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
