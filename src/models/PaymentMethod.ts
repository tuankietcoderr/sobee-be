import { IPaymentMethod } from "@/interface"
import { Schema, model } from "mongoose"
import { SCHEMA_NAME } from "./schema-name"

const PaymentMethodSchema = new Schema<IPaymentMethod>(
    {
        image: {
            type: Schema.Types.ObjectId,
            ref: SCHEMA_NAME.ASSETS
        },
        name: {
            type: String,
            required: true
        }
    },
    {
        versionKey: false
    }
)

export default model<IPaymentMethod>(SCHEMA_NAME.PAYMENT_METHODS, PaymentMethodSchema, SCHEMA_NAME.PAYMENT_METHODS)
