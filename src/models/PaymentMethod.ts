import { IPaymentMethod } from "@/interface"
import { Schema, model } from "mongoose"
import { SCHEMA_NAME } from "./schema-name"

const PaymentMethodSchema = new Schema<IPaymentMethod>(
    {
        image: String,
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

export default model<IPaymentMethod>(SCHEMA_NAME.PAYMENT_METHODS, PaymentMethodSchema, SCHEMA_NAME.PAYMENT_METHODS)
