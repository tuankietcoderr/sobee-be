import { ICustomer } from "@/interface"
import { Schema, Types, model } from "mongoose"
import { SCHEMA_NAME } from "./schema-name"
import { EGender } from "@/enum"

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
    },
    gender: {
      type: String,
      enum: EGender,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    versionKey: false
  }
)

export default model<ICustomer>(SCHEMA_NAME.CUSTOMERS, CustomerSchema, SCHEMA_NAME.CUSTOMERS)
