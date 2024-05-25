import { IReview, IRoute } from "@/interface"
import { ReviewService } from "./review.service"
import { Request, Response, Router } from "express"
import { ErrorResponse, HttpStatusCode, SuccessfulResponse } from "@/common/utils"
import middleware from "@/common/middleware"
import { EActionPermissions, EResourcePermissions } from "@/common/utils/rbac"
import { Review } from "@/models"
import { asyncHandler } from "@/common/utils"
import { ERole } from "@/enum"

export class ReviewController implements IRoute {
  private readonly router: Router
  private readonly path: string

  private readonly PATHS = {
    ROOT: "/",
    REVIEW: "/:reviewId",
    PRODUCT: "/product/:productId",
    CUSTOMER: "/customer/:customerId",
    LIKE: "/like/:reviewId",
    REPLY: "/reply/:reviewId",
    LIKE_REPLY: "/reply/like/:reviewId"
  }

  private static readonly reviewService = new ReviewService()

  constructor(path = "/api/review") {
    this.router = Router()
    this.path = path
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get(
      this.PATHS.ROOT,
      middleware.verifyToken,
      middleware.verifyRoles(ERole.ADMIN),
      asyncHandler(this.getReviews)
    )
    this.router.post(
      this.PATHS.ROOT,
      middleware.mustHaveFields<IReview>("content", "rating", "product"),
      middleware.doNotAllowFields<IReview>("customer"),
      asyncHandler(this.createReview)
    )
    this.router.put(
      this.PATHS.REVIEW,
      middleware.verifyToken,
      middleware.doNotAllowFields<IReview>("customer"),
      asyncHandler(this.updateReview)
    )

    this.router.put(this.PATHS.LIKE, middleware.verifyToken, asyncHandler(this.likeReview))
    this.router.put(this.PATHS.REPLY, asyncHandler(this.replyReview))
    this.router.put(this.PATHS.LIKE_REPLY, middleware.verifyToken, asyncHandler(this.likeReply))

    this.router.get(this.PATHS.REVIEW, asyncHandler(this.getReviewsById))
    this.router.get(this.PATHS.PRODUCT, asyncHandler(this.getReviewsByProductId))
    this.router.get(this.PATHS.CUSTOMER, middleware.verifyToken, asyncHandler(this.getReviewsByCustomerId))
    this.router.delete(
      this.PATHS.REVIEW,
      middleware.verifyToken,
      middleware.grandAccess(EActionPermissions.DELETEOWN, EResourcePermissions.REVIEW),
      middleware.veryfyOwner<IReview>("customer", Review, "reviewId"),
      asyncHandler(this.deleteReviewById)
    )
  }

  private async createReview(req: Request, res: Response): Promise<void> {
    const data = await ReviewController.reviewService.createReview({ ...req.body, customer: req.userId })
    new SuccessfulResponse(data, HttpStatusCode.CREATED, "Create review successfully").from(res)
  }

  private async updateReview(req: Request, res: Response): Promise<void> {
    const data = await ReviewController.reviewService.updateReview(req.params.reviewId, req.body, req.userId, req.role)
    new SuccessfulResponse(data, HttpStatusCode.OK, "Review updated successfully").from(res)
  }

  private async getReviews(req: Request, res: Response): Promise<void> {
    const data = await ReviewController.reviewService.getReviews()
    new SuccessfulResponse(data, HttpStatusCode.OK, "Get all reviews successfully").from(res)
  }

  private async getReviewsById(req: Request, res: Response): Promise<void> {
    const data = await ReviewController.reviewService.getReviewsById(req.params.reviewId)
    new SuccessfulResponse(data, HttpStatusCode.OK).from(res)
  }

  private async getReviewsByProductId(req: Request, res: Response): Promise<void> {
    const data = await ReviewController.reviewService.getReviewsByProductId(req.params.productId)
    new SuccessfulResponse(data, HttpStatusCode.OK).from(res)
  }

  private async getReviewsByCustomerId(req: Request, res: Response): Promise<void> {
    const data = await ReviewController.reviewService.getReviewsByCustomerId(req.params.customerId)
    new SuccessfulResponse(data, HttpStatusCode.OK).from(res)
  }

  private async deleteReviewById(req: Request, res: Response): Promise<void> {
    const data = await ReviewController.reviewService.deleteReviewById(req.params.reviewId)
    new SuccessfulResponse(data, HttpStatusCode.OK, "Review deleted successfully").from(res)
  }

  private async likeReview(req: Request, res: Response): Promise<void> {
    const data = await ReviewController.reviewService.likeReview(req.params.reviewId, req.userId)
    new SuccessfulResponse(data, HttpStatusCode.OK, "Like review successfully").from(res)
  }

  private async replyReview(req: Request, res: Response): Promise<void> {
    const data = await ReviewController.reviewService.replyReview(req.params.reviewId, req.body.content)
    new SuccessfulResponse(data, HttpStatusCode.OK, "Reply review successfully").from(res)
  }

  private async likeReply(req: Request, res: Response): Promise<void> {
    const data = await ReviewController.reviewService.likeReply(req.params.reviewId, req.userId)
    new SuccessfulResponse(data, HttpStatusCode.OK, "Like reply successfully").from(res)
  }

  getPath(): string {
    return this.path
  }

  getRouter(): Router {
    return this.router
  }
}
