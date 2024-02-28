import { IRoute } from "@/interface"
import { CouponService } from "./coupon.service"
import { Router } from "express"

export class CouponController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {}

    private static readonly couponService = new CouponService()

    constructor(path = "/api/coupon") {
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
