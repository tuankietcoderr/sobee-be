import { IFavorite } from "@/interface"
import { Schema, model } from "mongoose"
import { SCHEMA_NAME } from "./schema-name"

const FavoriteSchema = new Schema<IFavorite>(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: SCHEMA_NAME.CUSTOMERS
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: SCHEMA_NAME.PRODUCTS
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export default model<IFavorite>(SCHEMA_NAME.FAVORITES, FavoriteSchema, SCHEMA_NAME.FAVORITES)
