import { IOrder } from "@/interface"
import { Schema, model } from "mongoose"
import { SCHEMA_NAME } from "./schema-name"
import { EOrderStatus } from "@/enum"

const OrderSchema = new Schema<IOrder>(
    {
        canceledAt: {
            type: Date,
            default: null
        },
        completedAt: {
            type: Date,
            default: null
        },
        coupon: {
            type: Schema.Types.ObjectId,
            ref: SCHEMA_NAME.COUPONS
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: SCHEMA_NAME.USERS
        },
        deliveredAt: {
            type: Date,
            default: null
        },
        note: { type: String, default: null },
        orderGeneratedId: {
            type: String,
            required: true,
            unique: true
        },
        orderItems: [
            {
                ref: SCHEMA_NAME.ORDER_ITEMS,
                type: Schema.Types.ObjectId
            }
        ],
        paymentMethod: {
            type: String,
            required: true
        },
        shippingAddress: {
            type: Schema.Types.ObjectId,
            ref: SCHEMA_NAME.ADDRESSES
        },
        shippingFee: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: Object.values(EOrderStatus),
            default: EOrderStatus.PENDING
        },
        total: {
            type: Number,
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export default model<IOrder>(SCHEMA_NAME.ORDERS, OrderSchema, SCHEMA_NAME.ORDERS)
