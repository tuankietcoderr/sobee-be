import { EProductStatus, EProductType } from "@/enum"
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
        brand: {
            ref: SCHEMA_NAME.BRAND,
            type: Schema.Types.ObjectId,
            default: null
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
        displayPrice: {
            type: Number,
            required: true
        },
        minPrice: {
            type: Number,
            required: true
        },
        maxPrice: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            enum: Object.values(EProductType),
            default: EProductType.SIMPLE
        },
        favoritesCount: {
            type: Number,
            default: 0
        },
        variants: [
            {
                ref: SCHEMA_NAME.VARIANTS,
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
        },
        isDiscount: {
            type: Boolean,
            default: false
        },
        isDraft: {
            type: Boolean,
            default: false
        },
        isVariation: {
            type: Boolean,
            default: false
        },
        ratingCount: {
            type: Number,
            default: 0
        },
        ratingValue: {
            type: Number,
            default: 0
        },
        thumbnail: String
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export default model<IProduct>(SCHEMA_NAME.PRODUCTS, ProductSchema, SCHEMA_NAME.PRODUCTS)
