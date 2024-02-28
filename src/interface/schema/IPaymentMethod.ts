import { Types } from "mongoose"
import { IAsset } from "./IAsset"

export interface IPaymentMethod {
    name: string
    image: string | Types.ObjectId | IAsset
}
