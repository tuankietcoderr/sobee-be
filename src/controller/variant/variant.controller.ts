import { IRoute } from "@/interface"
import { VariantService } from "./variant.service"
import { Router } from "express"

export class VariantController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {}

    private static readonly VariantService = new VariantService()

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
