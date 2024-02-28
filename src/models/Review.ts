import { IReview } from "@/interface"
import { Schema, model } from "mongoose"
import { SCHEMA_NAME } from "./schema-name"

const ReviewSchema = new Schema<IReview>(
    {
        assets: [
            {
                ref: SCHEMA_NAME.ASSETS,
                type: Schema.Types.ObjectId
            }
        ],
        content: {
            required: true,
            type: String
        },
        customer: {
            ref: SCHEMA_NAME.CUSTOMERS,
            type: Schema.Types.ObjectId
        },
        product: {
            ref: SCHEMA_NAME.PRODUCTS,
            type: Schema.Types.ObjectId
        },
        rating: {
            max: 5,
            min: 1,
            required: true,
            type: Number
        },
        title: {
            required: true,
            type: String
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export default model<IReview>(SCHEMA_NAME.REVIEWS, ReviewSchema, SCHEMA_NAME.REVIEWS)
