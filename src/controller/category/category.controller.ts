import { ICategory, IRoute } from "@/interface"
import { CategoryService } from "./category.service"
import { Request, Response, Router } from "express"
import { ESTAFF_PERMISSIONS, ErrorResponse, HttpStatusCode, SuccessfulResponse } from "@/common/utils"
import middleware from "@/common/middleware"
import { ERole } from "@/enum"

export class CategoryController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {
        ROOT: "/",
        CATEGORY: "/:categoryId",
        GET_BY: "/:type/:categoryId", // type: slug, id
        PRODUCT: "/:categoryId/product"
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
            middleware.verifyStaffPermissions(ESTAFF_PERMISSIONS.CREATE_CATEGORY),
            middleware.mustHaveFields<ICategory>("name", "slug", "image"),
            this.createCategory
        )

        this.router.put(
            this.PATHS.CATEGORY,
            middleware.verifyToken,
            middleware.verifyRoles(ERole.ADMIN, ERole.STAFF),
            middleware.verifyStaffPermissions(ESTAFF_PERMISSIONS.UPDATE_CATEGORY),
            this.updateCategory
        )

        this.router.delete(
            this.PATHS.CATEGORY,
            middleware.verifyToken,
            middleware.verifyRoles(ERole.ADMIN, ERole.STAFF),
            middleware.verifyStaffPermissions(ESTAFF_PERMISSIONS.DELETE_CATEGORY),
            this.deleteCategory
        )

        this.router.get(this.PATHS.ROOT, this.getAllCategories)

        this.router.get(this.PATHS.GET_BY, this.getCategoryBy)

        this.router.get(this.PATHS.PRODUCT, this.getProductsByCategory)
    }

    private async createCategory(req: Request, res: Response): Promise<void> {
        try {
            const data = await CategoryController.categoryService.create(req.body)
            new SuccessfulResponse(data, HttpStatusCode.CREATED, "Category created successfully").from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.BAD_REQUEST, error.message).from(res)
        }
    }

    private async updateCategory(req: Request, res: Response): Promise<void> {
        try {
            const data = await CategoryController.categoryService.update(req.params.categoryId, req.body)
            new SuccessfulResponse(data, HttpStatusCode.OK, "Category updated successfully").from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.BAD_REQUEST, error.message).from(res)
        }
    }

    private async deleteCategory(req: Request, res: Response): Promise<void> {
        try {
            const data = await CategoryController.categoryService.delete(req.params.categoryId)
            new SuccessfulResponse(data, HttpStatusCode.OK, "Category deleted successfully").from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.BAD_REQUEST, error.message).from(res)
        }
    }

    private async getAllCategories(req: Request, res: Response): Promise<void> {
        try {
            const data = await CategoryController.categoryService.getAll()
            new SuccessfulResponse(data, HttpStatusCode.OK).from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.BAD_REQUEST, error.message).from(res)
        }
    }

    private async getCategoryBy(req: Request, res: Response): Promise<void> {
        try {
            const data = await CategoryController.categoryService.getBy(req.params.type as any, req.params.categoryId)
            new SuccessfulResponse(data, HttpStatusCode.OK).from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.BAD_REQUEST, error.message).from(res)
        }
    }

    private async getProductsByCategory(req: Request, res: Response): Promise<void> {
        try {
            const data = await CategoryController.categoryService.getProducts(req.params.categoryId)
            new SuccessfulResponse(data, HttpStatusCode.OK).from(res)
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
