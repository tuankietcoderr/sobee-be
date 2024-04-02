import { IAttribute, IRoute } from "@/interface"
import { AttributeService } from "./attribute.service"
import { Request, Response, Router } from "express"
import { ErrorResponse, HttpStatusCode, SuccessfulResponse } from "@/common/utils"
import middleware from "@/common/middleware"
import { ERole } from "@/enum"

export class AttributeController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {
        ROOT: "/",
        ATTRIBUTE: "/:attributeId"
    }

    private static readonly attributeService = new AttributeService()

    constructor(path = "/api/attribute") {
        this.router = Router()
        this.path = path
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(
            this.PATHS.ROOT,
            middleware.verifyToken,
            middleware.verifyRoles(ERole.ADMIN, ERole.STAFF),
            middleware.mustHaveFields<IAttribute>("name", "description"),
            this.createAttribute
        )
        this.router.put(
            this.PATHS.ATTRIBUTE,
            middleware.verifyToken,
            middleware.verifyRoles(ERole.ADMIN, ERole.STAFF),
            this.updateAttribute
        )
        this.router.delete(
            this.PATHS.ATTRIBUTE,
            middleware.verifyToken,
            middleware.verifyRoles(ERole.ADMIN, ERole.STAFF),
            this.deleteAttribute
        )
        this.router.get(this.PATHS.ROOT, this.getAllAttribute)
        this.router.get(this.PATHS.ATTRIBUTE, this.getAttribute)
    }

    private async createAttribute(req: Request, res: Response) {
        try {
            const attribute = await AttributeController.attributeService.create(req.body)
            new SuccessfulResponse(attribute, HttpStatusCode.CREATED, "Attribute created succesfully!").from(res)
        } catch (e: any) {
            new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, e.message).from(res)
        }
    }

    private async updateAttribute(req: Request, res: Response) {
        try {
            const attribute = await AttributeController.attributeService.update(req.params.attributeId, req.body)
            new SuccessfulResponse(attribute, HttpStatusCode.OK, "Attribute updated succesfully!").from(res)
        } catch (e: any) {
            new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, e.message).from(res)
        }
    }

    private async deleteAttribute(req: Request, res: Response) {
        try {
            const attribute = await AttributeController.attributeService.delete(req.params.attributeId)
            new SuccessfulResponse(attribute, HttpStatusCode.OK, "Attribute deleted succesfully!").from(res)
        } catch (e: any) {
            new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, e.message).from(res)
        }
    }

    private async getAllAttribute(req: Request, res: Response) {
        try {
            const attributes = await AttributeController.attributeService.getAll()
            new SuccessfulResponse(attributes, HttpStatusCode.OK, "Attribute retrieved succesfully!").from(res)
        } catch (e: any) {
            new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, e.message).from(res)
        }
    }

    private async getAttribute(req: Request, res: Response) {
        try {
            const attribute = await AttributeController.attributeService.getById(req.params.attributeId)
            new SuccessfulResponse(attribute, HttpStatusCode.OK, "Attribute retrieved succesfully!").from(res)
        } catch (e: any) {
            new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, e.message).from(res)
        }
    }

    getPath(): string {
        return this.path
    }

    getRouter(): Router {
        return this.router
    }
}
