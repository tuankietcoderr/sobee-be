import { IReview } from "@/interface"
import { CreateReviewRequest, CreateReviewResponse } from "./dto"
import { DeleteResult } from "mongodb"

export abstract class ReviewRepository {
  abstract createReview(data: CreateReviewRequest): Promise<CreateReviewResponse>
  abstract updateReview(reviewId: string, data: Partial<IReview>, requestId: string, role: string): Promise<IReview>
  abstract getReviewsById(reviewId: string): Promise<IReview>
  abstract getReviewsByProductId(productId: string): Promise<IReview[]>
  abstract getReviewsByCustomerId(customerId: string): Promise<IReview[]>
  abstract deleteReviewById(reviewId: string, requestId: string, role: string): Promise<DeleteResult>
}
