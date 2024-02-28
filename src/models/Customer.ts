import { ICustomer } from "@/interface"
import { Schema, Types, model } from "mongoose"
import { SCHEMA_NAME } from "./schema-name"

const CustomerSchema = new Schema<ICustomer>(
    {
        addresses: [
            {
                type: Schema.Types.ObjectId,
                ref: SCHEMA_NAME.ADDRESSES
            }
        ],
        emailVerifiedAt: {
            type: Date,
            default: null
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        phoneNumberVerifiedAt: {
            type: Date,
            default: null
        },
        isPhoneNumberVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        versionKey: false
    }
)

export default model<ICustomer>(SCHEMA_NAME.CUSTOMERS, CustomerSchema, SCHEMA_NAME.CUSTOMERS)
