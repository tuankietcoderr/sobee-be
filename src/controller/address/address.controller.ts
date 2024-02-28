import { IRoute } from "@/interface"
import { AddressService } from "./address.service"
import { Router } from "express"

export class AddressController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {}

    private static readonly addressService = new AddressService()

    constructor(path = "/api/address") {
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
