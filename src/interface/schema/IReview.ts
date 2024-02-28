import { Types } from "mongoose"
import { IProduct } from "./IProduct"
import { ICustomer } from "./ICustomer"
import { IAsset } from "./IAsset"

export interface IReview {
    product: string | Types.ObjectId | IProduct
    customer: string | Types.ObjectId | ICustomer
    rating: number
    title: string
    content: string
    assets: string[] | Types.ObjectId[] | IAsset[]
}
