import { IRoute } from "@/interface"
import { RoleService } from "./role.service"
import { Request, Response, Router } from "express"
import { ErrorResponse, HttpStatusCode, SuccessfulResponse } from "@/common/utils"
import middleware from "@/common/middleware"
import { ERole } from "@/enum"
import { EActionPermissions, EResourcePermissions, EResourceToModel } from "@/common/utils/rbac"

export class RoleController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {
        ROOT: "/",
        ROLE: "/:roleId",
        ROLE_NAME: "/roleName"
    }

    private static readonly roleService = new RoleService()

    constructor(path = "/api/role") {
        this.router = Router()
        this.router.use(middleware.verifyToken)
        this.router.use(middleware.verifyRoles(ERole.ADMIN))
        this.path = path
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(this.PATHS.ROOT, this.createRole)
        this.router.get(this.PATHS.ROOT, this.getAllRoles)
        this.router.get(this.PATHS.ROLE_NAME, this.getListRoleName)
    }

    private async createRole(req: Request, res: Response): Promise<void> {
        try {
            const role = await RoleController.roleService.create(req.body)
            new SuccessfulResponse(role, HttpStatusCode.CREATED, "Role created successfully").from(res)
        } catch (error: any) {
            new ErrorResponse(error.statusCode, error.message).from(res)
        }
    }

    private async getAllRoles(req: Request, res: Response): Promise<void> {
        try {
            const role = await RoleController.roleService.getAll()

            new SuccessfulResponse(role, HttpStatusCode.OK).from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message).from(res)
        }
    }
    private async getListRoleName(req: Request, res: Response): Promise<void> {
        try {
            const role = await RoleController.roleService.getListRoleName()
            new SuccessfulResponse(role, HttpStatusCode.OK).from(res)
        } catch (error: any) {
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
