import { Types } from "mongoose"
import { ICustomer } from "./ICustomer"

export interface IAddress {
    country: string
    postalCode: string
    city: string
    district: string
    ward: string
    street: string
    specificAddress: string
    isDefault: boolean
    customer: string | ICustomer | Types.ObjectId
}
