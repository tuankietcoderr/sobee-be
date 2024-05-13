import { IBrand, IRoute } from "@/interface"
import { BrandService } from "./brand.service"
import { Request, Response, Router } from "express"
import middleware from "@/common/middleware"
import { HttpStatusCode, SuccessfulResponse, asyncHandler } from "@/common/utils"

export class BrandController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {
        ROOT: "/",
        ID: "/:id"
    }

    private static readonly brandService = new BrandService()

    constructor(path = "/api/brand") {
        this.router = Router()
        this.path = path
        this.router.use(middleware.verifyToken)
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(
            this.PATHS.ROOT,
            middleware.mustHaveFields<IBrand>("name", "logo", "website"),
            asyncHandler(this.create)
        )
        this.router.put(this.PATHS.ID, asyncHandler(this.update))
        this.router.delete(this.PATHS.ID, asyncHandler(this.delete))
        this.router.get(this.PATHS.ROOT, asyncHandler(this.findAll))
        this.router.get(this.PATHS.ID, asyncHandler(this.findById))
    }

    async create(req: Request, res: Response): Promise<void> {
        const data = await BrandController.brandService.create(req.body)
        new SuccessfulResponse(data, HttpStatusCode.CREATED, "Create brand successfully").from(res)
    }

    async update(req: Request, res: Response): Promise<void> {
        const data = await BrandController.brandService.update(req.params.id, req.body)
        new SuccessfulResponse(data, HttpStatusCode.OK, "Update brand successfully").from(res)
    }

    async delete(req: Request, res: Response): Promise<void> {
        const data = await BrandController.brandService.delete(req.params.id)
        new SuccessfulResponse(data, HttpStatusCode.OK, "Delete brand successfully").from(res)
    }

    async findAll(req: Request, res: Response): Promise<void> {
        const data = await BrandController.brandService.findAll()
        new SuccessfulResponse(data, HttpStatusCode.OK).from(res)
    }

    async findById(req: Request, res: Response): Promise<void> {
        const data = await BrandController.brandService.findById(req.params.id)
        new SuccessfulResponse(data, HttpStatusCode.OK).from(res)
    }

    getPath(): string {
        return this.path
    }

    getRouter(): Router {
        return this.router
    }
}