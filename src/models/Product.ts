import { EProductStatus } from "@/enum"
import { IProduct } from "@/interface"
import { Schema, model } from "mongoose"
import { SCHEMA_NAME } from "./schema-name"

const ProductSchema = new Schema<IProduct>(
    {
        category: {
            ref: SCHEMA_NAME.CATEGORIES,
            type: Schema.Types.ObjectId
        },
        name: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            unique: true
        },
        description: String,
        deletedAt: {
            type: Date,
            default: null
        },
        isFeatured: {
            type: Boolean,
            default: false
        },
        discount: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: true
        },
        productAssetAttributes: [
            {
                ref: SCHEMA_NAME.PRODUCT_ASSET_ATTRIBUTES,
                type: Schema.Types.ObjectId
            }
        ],
        quantity: {
            type: Number,
            required: true
        },
        sold: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: Object.values(EProductStatus),
            default: EProductStatus.ACTIVE
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export default model<IProduct>(SCHEMA_NAME.PRODUCTS, ProductSchema, SCHEMA_NAME.PRODUCTS)
