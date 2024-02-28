import { IRoute } from "@/interface"
import { AttributeService } from "./attribute.service"
import { Router } from "express"

export class AttributeController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {}

    private static readonly attributeService = new AttributeService()

    constructor(path = "/api/attribute") {
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
