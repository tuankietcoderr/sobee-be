import { Types } from "mongoose"
import { ICustomer } from "./ICustomer"
import { EOrderStatus } from "@/enum"
import { IAddress } from "./IAddress"
import { IOrderItem } from "./IOrderItem"
import { IPaymentMethod } from "./IPaymentMethod"
import { ICoupon } from "./ICoupon"

export interface IOrder {
    orderGeneratedId: string
    orderItems: Types.ObjectId[] | IOrderItem[] | string[]
    customer: Types.ObjectId | ICustomer | string
    status: EOrderStatus
    shippingFee: number
    total: number
    paymentMethod: Types.ObjectId | string | IPaymentMethod
    shippingAddress: Types.ObjectId | IAddress | string
    note: string
    coupon: Types.ObjectId | string | ICoupon
    canceledAt: Date
    deliveredAt: Date
    completedAt: Date
}
