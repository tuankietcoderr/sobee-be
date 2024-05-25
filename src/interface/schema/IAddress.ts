import { Types } from "mongoose"
import { ICustomer } from "./ICustomer"

export interface IAddress {
  name: string
  phoneNumber: string
  country: string
  city: string
  district: string
  ward: string
  specificAddress: string
  isDefault: boolean
  customer: string | ICustomer | Types.ObjectId
}
