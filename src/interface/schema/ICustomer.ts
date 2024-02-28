import { Types } from "mongoose"
import { IAddress } from "./IAddress"

export interface ICustomer {
    isPhoneNumberVerified?: boolean
    phoneNumberVerifiedAt?: Date
    isEmailVerified?: boolean
    emailVerifiedAt?: Date
    addresses: string[] | Types.ObjectId[] | IAddress[]
}
