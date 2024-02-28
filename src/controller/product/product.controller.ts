import { IRoute } from "@/interface"
import { Router } from "express"
import { ProductService } from "./product.service"

export class ProductController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {}

    private static readonly productService = new ProductService()

    constructor(path = "/api/product") {
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
