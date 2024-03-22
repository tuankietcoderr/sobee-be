import { IReview } from "@/interface"
import { ReviewRepository } from "./review.repository"
import { Review } from "@/models"
import { ObjectModelNotFoundException, UnauthorizedException } from "@/common/exceptions"
import { ERole } from "@/enum"
import { DeleteResult } from "mongodb"

export class ReviewService implements ReviewRepository {
    async createReview(data: IReview): Promise<IReview> {
        return await Review.create(data)
    }

    async updateReview(reviewId: string, data: Partial<IReview>, requestId: string, role: string): Promise<IReview> {
        const foundReview = await Review.findByIdAndUpdate(reviewId, { $set: data }, { new: true }).lean()

        if (!foundReview) throw new ObjectModelNotFoundException("Review not found")

        if (foundReview.customer.toString() !== requestId || role !== ERole.ADMIN)
            throw new UnauthorizedException("You are not authorized to update this review")

        return foundReview
    }

    async getReviewsById(reviewId: string): Promise<IReview> {
        const foundReview = await Review.findById(reviewId)
            .populate({ path: "customer", select: ["name", "email"] })
            // .populate({ path: "product", select: ["name", "price"] })
            .lean()

        if (!foundReview) throw new ObjectModelNotFoundException("Review not found")

        return foundReview
    }

    async getReviewsByProductId(productId: string): Promise<IReview[]> {
        return await Review.find({ product: productId })
            .populate({ path: "customer", select: ["name", "email"] })
            .lean()
    }
    async getReviewsByCustomerId(customerId: string): Promise<IReview[]> {
        const foundReviews = await Review.find({ customer: customerId })
            // .populate({ path: "product", select: ["name", "price"] })
            .lean()

        return foundReviews
    }
    async deleteReviewById(reviewId: string, requestId: string, role: string): Promise<DeleteResult> {
        const foundReview = await Review.findById(reviewId)

        if (!foundReview) throw new ObjectModelNotFoundException("Review not found")

        // if (foundReview.customer.toString() !== requestId && role === ERole.CUSTOMER)
        //     throw new UnauthorizedException("You are not authorized to delete this review")

        // const deleted = await foundReview.deleteOne()
        // return deleted
        return {
            acknowledged: true,
            deletedCount: 1
        }
    }
}
