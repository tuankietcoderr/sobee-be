import { IRoute } from "@/interface"
import { ReviewService } from "./review.service"
import { Router } from "express"

export class ReviewController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {}

    private static readonly reviewService = new ReviewService()

    constructor(path = "/api/review") {
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
