import { Types } from "mongoose"
import { ICustomer } from "./ICustomer"
import { ECouponStatus } from "@/enum"

export interface ICoupon {
    code: string
    discountValue: number
    startDate: Date
    endDate: Date
    usageLimit: number
    usageCount: number
    customerUsed: string[] | ICustomer[] | Types.ObjectId[]
    status: ECouponStatus
}
