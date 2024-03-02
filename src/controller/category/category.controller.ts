import { ICategory, IRoute } from "@/interface"
import { CategoryService } from "./category.service"
import { Request, Response, Router } from "express"
import { ErrorResponse, HttpStatusCode, SuccessfulResponse } from "@/common/utils"
import middleware from "@/common/middleware"
import { ERole } from "@/enum"

export class CategoryController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {
        ROOT: "/",
        CATEGORY: "/:categoryId",
        GET_BY: "/:type/:categoryId" // type: slug, id
    }

    private static readonly categoryService = new CategoryService()

    constructor(path = "/api/category") {
        this.router = Router()
        this.path = path
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(
            this.PATHS.ROOT,
            middleware.verifyToken,
            middleware.verifyRoles(ERole.ADMIN, ERole.STAFF),
            middleware.mustHaveFields<ICategory>("name", "slug"),
            this.createCategory
        )
    }

    private async createCategory(req: Request, res: Response): Promise<void> {
        try {
            const data = await CategoryController.categoryService.create(req.body)
            new SuccessfulResponse(data, HttpStatusCode.CREATED, "Category created successfully").from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.BAD_REQUEST, error.message).from(res)
        }
    }

    getPath(): string {
        return this.path
    }

    getRouter(): Router {
        return this.router
    }
}
