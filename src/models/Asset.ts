import { IAsset } from "@/interface"
import { Schema, model } from "mongoose"
import { SCHEMA_NAME } from "./schema-name"

const AssetSchema = new Schema<IAsset>(
    {
        filename: String,
        size: Number,
        mimeType: {
            type: String
        },
        urlPath: String
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export default model<IAsset>(SCHEMA_NAME.ASSETS, AssetSchema, SCHEMA_NAME.ASSETS)
