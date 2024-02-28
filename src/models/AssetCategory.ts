import { IAssetCategory } from "@/interface"
import { Schema, model } from "mongoose"
import { SCHEMA_NAME } from "./schema-name"

const AssetCategorySchema = new Schema<IAssetCategory>(
    {
        assets: [
            {
                type: Schema.Types.ObjectId,
                ref: SCHEMA_NAME.ASSETS
            }
        ],
        name: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        versionKey: false
    }
)

export default model<IAssetCategory>(SCHEMA_NAME.ASSET_CATEGORIES, AssetCategorySchema, SCHEMA_NAME.ASSET_CATEGORIES)
