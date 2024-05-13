import { Types } from "mongoose"
import { IAsset } from "./IAsset"

export interface IPaymentMethod {
    _id?: string | Types.ObjectId
    name: string
    image: string
}
