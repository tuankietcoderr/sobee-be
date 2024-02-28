import { IOrderItem } from "@/interface"
import { Schema, model } from "mongoose"
import { SCHEMA_NAME } from "./schema-name"

const OrderItemSchema = new Schema<IOrderItem>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: SCHEMA_NAME.PRODUCTS
        },
        quantity: {
            type: Number,
            required: true
        }
    },
    {
        versionKey: false
    }
)

export default model<IOrderItem>(SCHEMA_NAME.ORDER_ITEMS, OrderItemSchema, SCHEMA_NAME.ORDER_ITEMS)
