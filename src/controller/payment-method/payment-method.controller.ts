import { IRoute } from "@/interface"
import { PaymentMethodService } from "./payment-method.service"
import { Request, Response, Router } from "express"
import { HttpStatusCode, SuccessfulResponse, asyncHandler } from "@/common/utils"
import middleware from "@/common/middleware"
import { ERole } from "@/enum"
import { EActionPermissions } from "@/common/utils/rbac"

export class PaymentMethodController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {
        ROOT: "/",
        PAYMENT_METHOD: "/:paymentMethodId"
    }

    private static readonly paymentMethodService = new PaymentMethodService()

    constructor(path = "/api/payment-method") {
        this.router = Router()
        this.router.use(middleware.verifyToken)
        this.router.use(middleware.verifyRoles(ERole.ADMIN, ERole.STAFF))
        this.path = path
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(this.PATHS.ROOT, middleware.mustHaveFields("name"), asyncHandler(this.createPaymentMethod))
        this.router.put(this.PATHS.PAYMENT_METHOD, asyncHandler(this.updatePaymentMethod))
        this.router.get(this.PATHS.ROOT, asyncHandler(this.getAllPaymentMethodes))
        this.router.get(this.PATHS.PAYMENT_METHOD, asyncHandler(this.getPaymentMethod))
        this.router.delete(this.PATHS.PAYMENT_METHOD, asyncHandler(this.deletePaymentMethod))
    }

    private async createPaymentMethod(req: Request, res: Response): Promise<void> {
        const paymentMethod = await PaymentMethodController.paymentMethodService.create(req.body)

        new SuccessfulResponse(paymentMethod, HttpStatusCode.CREATED, "PaymentMethod created successfully").from(res)
    }

    private async updatePaymentMethod(req: Request, res: Response): Promise<void> {
        const paymentMethod = await PaymentMethodController.paymentMethodService.update(
            req.params.paymentMethodId,
            req.body
        )

        new SuccessfulResponse(paymentMethod, HttpStatusCode.OK, "PaymentMethod updated successfully").from(res)
    }

    private async getAllPaymentMethodes(req: Request, res: Response): Promise<void> {
        const paymentMethodes = await PaymentMethodController.paymentMethodService.getAll()

        new SuccessfulResponse(paymentMethodes, HttpStatusCode.OK).from(res)
    }

    private async getPaymentMethod(req: Request, res: Response): Promise<void> {
        const paymentMethod = await PaymentMethodController.paymentMethodService.getOne(
            "_id",
            req.params.paymentMethodId
        )

        new SuccessfulResponse(paymentMethod, HttpStatusCode.OK).from(res)
    }

    private async deletePaymentMethod(req: Request, res: Response): Promise<void> {
        const data = await PaymentMethodController.paymentMethodService.delete(req.params.paymentMethodId)

        new SuccessfulResponse(data, HttpStatusCode.OK, "PaymentMethod deleted successfully").from(res)
    }

    getPath(): string {
        return this.path
    }

    getRouter(): Router {
        return this.router
    }
}
