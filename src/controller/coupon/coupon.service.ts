import { ICoupon } from "@/interface"
import { CouponRepository } from "./coupon.repository"
import { Coupon } from "@/models"
import { ObjectModelNotFoundException } from "@/common/exceptions"
import { ECouponStatus } from "@/enum"

export class CouponService implements CouponRepository {
    async create(data: ICoupon): Promise<ICoupon> {
        const { startDate, endDate, discountValue, code } = data

        if (startDate < new Date()) throw new Error("Start date cannot be in the past")

        if (startDate > endDate) throw new Error("Start date cannot be greater than end date")

        if (discountValue < 0) throw new Error("Discount value cannot be negative")

        return await Coupon.create(data)
    }
    async update(id: string, data: Partial<ICoupon>): Promise<ICoupon> {
        const updated = await Coupon.findByIdAndUpdate(id, { $set: data }, { new: true })
        if (!updated) throw new ObjectModelNotFoundException("Coupon not found")
        return updated
    }
    async delete(id: string): Promise<ICoupon> {
        const deleted = await Coupon.findByIdAndDelete(id)
        if (!deleted) throw new ObjectModelNotFoundException("Coupon not found")
        return deleted
    }
    async getAll(): Promise<ICoupon[]> {
        return await Coupon.find()
    }

    async getById(id: string): Promise<ICoupon> {
        const coupon = await Coupon.findById(id)
        if (!coupon) throw new ObjectModelNotFoundException("Coupon not found")
        return coupon
    }

    async getUserCoupons(userId: string): Promise<ICoupon[]> {
        return await Coupon.find({
            customerUsed: {
                $elemMatch: {
                    $eq: userId
                }
            }
        })
    }

    async use(id: string, userId: string): Promise<ICoupon> {
        const coupon = await Coupon.findById(id)

        if (!coupon) throw new ObjectModelNotFoundException("Coupon not found")

        if (coupon.status === ECouponStatus.DISABLED) throw new Error("Coupon disabled")

        if (coupon.endDate < new Date()) {
            coupon.status = ECouponStatus.EXPIRED
            await coupon.save()
            throw new Error("Coupon expired")
        }

        if (coupon.customerUsed.includes(userId as any)) throw new Error("Coupon already used")

        coupon.customerUsed.push(userId as any)

        coupon.usageCount++

        if (coupon.usageCount === coupon.usageLimit) {
            coupon.status = ECouponStatus.DISABLED
        } else if (coupon.usageCount > coupon.usageLimit) {
            throw new Error("Coupon usage limit exceeded")
        }

        await coupon.save()

        return coupon
    }
}
