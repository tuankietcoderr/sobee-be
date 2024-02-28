import { IProductAssetAttribute } from "@/interface"
import { Schema, model } from "mongoose"
import { SCHEMA_NAME } from "./schema-name"

const ProductAssetAttribute = new Schema<IProductAssetAttribute>(
    {
        amount: {
            type: Number,
            required: true
        },
        assets: [
            {
                ref: SCHEMA_NAME.ASSETS,
                type: Schema.Types.ObjectId
            }
        ],
        attribute: {
            ref: SCHEMA_NAME.ATTRIBUTES,
            type: Schema.Types.ObjectId
        },
        product: {
            ref: SCHEMA_NAME.PRODUCTS,
            type: Schema.Types.ObjectId
        },
        value: {
            type: String,
            required: true
        }
    },
    {
        versionKey: false
    }
)

export default model<IProductAssetAttribute>(
    SCHEMA_NAME.PRODUCT_ASSET_ATTRIBUTES,
    ProductAssetAttribute,
    SCHEMA_NAME.PRODUCT_ASSET_ATTRIBUTES
)
