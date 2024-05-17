import { ICoupon } from "@/interface"
import { Schema, model } from "mongoose"
import { SCHEMA_NAME } from "./schema-name"
import { ECouponStatus } from "@/enum"

const CouponSchema = new Schema<ICoupon>(
    {
        code: {
            type: String,
            required: true,
            unique: true
        },
        customerUsed: [
            {
                type: Schema.Types.ObjectId,
                ref: SCHEMA_NAME.USERS
            }
        ],
        discountValue: {
            type: Number,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: Object.values(ECouponStatus),
            default: ECouponStatus.ACTIVE
        },
        usageCount: {
            type: Number,
            default: 0
        },
        usageLimit: {
            type: Number,
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export default model<ICoupon>(SCHEMA_NAME.COUPONS, CouponSchema, SCHEMA_NAME.COUPONS)
