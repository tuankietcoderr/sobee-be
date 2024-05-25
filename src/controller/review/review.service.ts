import { IReply, IReview } from "@/interface"
import { ReviewRepository } from "./review.repository"
import { Reply, Review } from "@/models"
import { ObjectModelNotFoundException, UnauthorizedException } from "@/common/exceptions"
import { ERole } from "@/enum"
import { DeleteResult } from "mongodb"
import { getIdFromNameId } from "@/common/utils"

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
      .populate({ path: "customer" })
      .populate({ path: "product" })
      .lean()

    if (!foundReview) throw new ObjectModelNotFoundException("Review not found")

    return foundReview
  }

  //get all review and paginate
  async getReviews(): Promise<IReview[]> {
    return await Review.find().populate({ path: "customer" }).populate({ path: "product" }).lean()
  }

  async getReviewsByProductId(productId: string): Promise<IReview[]> {
    const processedSlug = getIdFromNameId(productId)
    return await Review.find({ product: processedSlug })
      .populate({ path: "customer", select: ["name", "email"] })
      .lean()
  }
  async getReviewsByCustomerId(customerId: string): Promise<IReview[]> {
    const foundReviews = await Review.find({ customer: customerId })
      // .populate({ path: "product", select: ["name", "price"] })
      .lean()

    return foundReviews
  }
  async deleteReviewById(reviewId: string): Promise<DeleteResult> {
    const foundReview = await Review.findById(reviewId)

    if (!foundReview) throw new ObjectModelNotFoundException("Review not found")

    const deleted = await foundReview.deleteOne()
    return deleted
  }

  async replyReview(reviewId: string, content: string): Promise<IReview> {
    const foundReview = await Review.findById(reviewId)
    if (!foundReview) throw new ObjectModelNotFoundException("Review not found")

    if (foundReview.reply) {
      foundReview.reply.content = content
    } else {
      const reply: IReply = {
        content,
        likes: []
      }
      foundReview.reply = reply
    }
    await foundReview.save()

    return foundReview
  }

  async likeReview(reviewId: string, userId: string): Promise<IReview> {
    const foundReview = await Review.findById(reviewId)
    if (!foundReview) throw new ObjectModelNotFoundException("Review not found")

    if (foundReview.likes.includes(userId)) {
      foundReview.likes = foundReview.likes.filter((id) => id !== userId)
    } else {
      foundReview.likes.push(userId)
    }

    await foundReview.save()

    return foundReview
  }

  async likeReply(reviewId: string, userId: string): Promise<IReview> {
    const foundReview = await Review.findById(reviewId)
    if (!foundReview) throw new ObjectModelNotFoundException("Review not found")

    if (!foundReview.reply) throw new ObjectModelNotFoundException("Reply not found")

    if (foundReview.reply.likes.includes(userId)) {
      foundReview.reply.likes = foundReview.reply.likes.filter((id) => id !== userId)
    } else {
      foundReview.reply.likes.push(userId)
    }

    await foundReview.save()

    return foundReview
  }
}
