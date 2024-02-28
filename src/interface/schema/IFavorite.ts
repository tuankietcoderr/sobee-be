import { Types } from "mongoose"
import { ICustomer } from "./ICustomer"
import { IProduct } from "./IProduct"

export interface IFavorite {
    customer: string | Types.ObjectId | ICustomer
    product: string | Types.ObjectId | IProduct
}
