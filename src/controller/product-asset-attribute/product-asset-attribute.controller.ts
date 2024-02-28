import { IRoute } from "@/interface"
import { ProductAssetAttributeService } from "./product-asset-attribute.service"
import { Router } from "express"

export class ProductAssetAttributeController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {}

    private static readonly productAssetAttributeService = new ProductAssetAttributeService()

    constructor(path = "/api/product-asset-attribute") {
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
