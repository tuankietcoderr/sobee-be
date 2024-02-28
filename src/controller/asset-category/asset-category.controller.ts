import { IRoute } from "@/interface"
import { AssetCategoryService } from "./asset-category.service"
import { Router } from "express"

export class AssetCategoryController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {}

    private static readonly assetCategoryService = new AssetCategoryService()

    constructor(path = "/api/asset-category") {
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
