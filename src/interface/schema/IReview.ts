import { Types } from "mongoose"
import { IProduct } from "./IProduct"
import { ICustomer } from "./ICustomer"
import { IAsset } from "./IAsset"
import { IUser } from "./IUser"

export interface IReview {
    product: string | Types.ObjectId | IProduct
    customer: string | Types.ObjectId | IUser
    rating: number
    title: string
    content: string
    assets: string[] | Types.ObjectId[] | IAsset[]
}
