import { ICoupon, IRoute } from "@/interface"
import { CouponService } from "./coupon.service"
import { Request, Response, Router } from "express"
import { ESTAFF_PERMISSIONS, ErrorResponse, HttpStatusCode, SuccessfulResponse } from "@/common/utils"
import middleware from "@/common/middleware"
import { ERole } from "@/enum"

export class CouponController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {
        ROOT: "/",
        COUPON: "/:couponId",
        USER: "/user",
        USE: "/:couponId/use"
    }

    private static readonly couponService = new CouponService()

    constructor(path = "/api/coupon") {
        this.router = Router()
        this.path = path
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(
            this.PATHS.ROOT,
            middleware.verifyToken,
            middleware.verifyRoles(ERole.ADMIN, ERole.STAFF),
            middleware.verifyStaffPermissions(ESTAFF_PERMISSIONS.CREATE_COUPON),
            middleware.mustHaveFields<ICoupon>("code", "discountValue", "startDate", "endDate", "usageLimit"),
            middleware.doNotAllowFields<ICoupon>("customerUsed", "status", "usageCount"),
            this.createCoupon
        )
        this.router.put(
            this.PATHS.COUPON,
            middleware.verifyToken,
            middleware.verifyRoles(ERole.ADMIN, ERole.STAFF),
            middleware.verifyStaffPermissions(ESTAFF_PERMISSIONS.UPDATE_COUPON),
            this.updateCoupon
        )
        this.router.delete(
            this.PATHS.COUPON,
            middleware.verifyToken,
            middleware.verifyRoles(ERole.ADMIN, ERole.STAFF),
            middleware.verifyStaffPermissions(ESTAFF_PERMISSIONS.DELETE_COUPON),
            this.deleteCoupon
        )
        this.router.get(this.PATHS.ROOT, this.getCoupons)
        this.router.get(this.PATHS.USER, middleware.verifyToken, this.getUserCoupons)
        this.router.get(this.PATHS.COUPON, this.getCoupon)
        this.router.put(this.PATHS.USE, middleware.verifyToken, this.useCoupon)
    }

    private async createCoupon(req: Request, res: Response): Promise<void> {
        try {
            const data = await CouponController.couponService.create(req.body)
            new SuccessfulResponse(data, HttpStatusCode.CREATED, "Coupon created successfully").from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.BAD_REQUEST, error.message).from(res)
        }
    }

    private async updateCoupon(req: Request, res: Response): Promise<void> {
        try {
            const data = await CouponController.couponService.update(req.params.couponId, req.body)
            new SuccessfulResponse(data, HttpStatusCode.OK, "Coupon updated successfully").from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.BAD_REQUEST, error.message).from(res)
        }
    }

    private async deleteCoupon(req: Request, res: Response): Promise<void> {
        try {
            const data = await CouponController.couponService.delete(req.params.couponId)
            new SuccessfulResponse(data, HttpStatusCode.OK, "Coupon deleted successfully").from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.BAD_REQUEST, error.message).from(res)
        }
    }

    private async getCoupon(req: Request, res: Response): Promise<void> {
        try {
            const data = await CouponController.couponService.getById(req.params.couponId)
            new SuccessfulResponse(data, HttpStatusCode.OK).from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.BAD_REQUEST, error.message).from(res)
        }
    }

    private async getCoupons(req: Request, res: Response): Promise<void> {
        try {
            const data = await CouponController.couponService.getAll()
            new SuccessfulResponse(data, HttpStatusCode.OK).from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.BAD_REQUEST, error.message).from(res)
        }
    }

    private async getUserCoupons(req: Request, res: Response): Promise<void> {
        try {
            const data = await CouponController.couponService.getUserCoupons(req.userId)
            new SuccessfulResponse(data, HttpStatusCode.OK).from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.BAD_REQUEST, error.message).from(res)
        }
    }

    private async useCoupon(req: Request, res: Response): Promise<void> {
        try {
            const data = await CouponController.couponService.use(req.params.couponId, req.userId)
            new SuccessfulResponse(data, HttpStatusCode.OK, "Coupon used successfully").from(res)
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
