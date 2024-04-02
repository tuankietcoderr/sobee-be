import { IRoute } from "@/interface"
import { StaffService } from "./staff.service"
import { Request, Response, Router } from "express"
import { ErrorResponse, HttpStatusCode, SuccessfulResponse } from "@/common/utils"
import middleware from "@/common/middleware"

export class StaffController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {
        ROOT: "/",
        STAFF: "/:staffId"
    }

    private static readonly staffService = new StaffService()

    constructor(path = "/api/staff") {
        this.router = Router()
        this.router.use(middleware.verifyToken)
        this.path = path
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(this.PATHS.ROOT, this.createStaff)
    }

    private async createStaff(req: Request, res: Response): Promise<void> {
        try {
            const result = await StaffController.staffService.create(req.body)
            new SuccessfulResponse(result, HttpStatusCode.CREATED, "Staff created successfully.").from(res)
        } catch (error: any) {
            console.error(error)
            new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message).from(res)
        }
    }

    getPath(): string {
        return this.path
    }

    getRouter(): Router {
        return this.router
    }
}
