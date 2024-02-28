import { IRoute } from "@/interface"
import { CategoryService } from "./category.service"
import { Router } from "express"

export class CategoryController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {}

    private static readonly categoryService = new CategoryService()

    constructor(path = "/api/category") {
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
