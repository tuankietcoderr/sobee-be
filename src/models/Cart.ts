import { ICart } from "@/interface"
import { Schema, model } from "mongoose"
import { SCHEMA_NAME } from "./schema-name"

const CartSchema = new Schema<ICart>(
    {
        cartItems: [
            {
                type: Schema.Types.ObjectId,
                ref: SCHEMA_NAME.ORDER_ITEMS
            }
        ],
        customer: {
            type: Schema.Types.ObjectId,
            ref: SCHEMA_NAME.CUSTOMERS
        }
    },
    {
        versionKey: false
    }
)

export default model<ICart>(SCHEMA_NAME.CARTS, CartSchema, SCHEMA_NAME.CARTS)
