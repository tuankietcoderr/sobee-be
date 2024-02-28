import { Types } from "mongoose"
import { IProduct } from "./IProduct"
import { IAsset } from "./IAsset"
import { IAttribute } from "./IAttribute"

export interface IProductAssetAttribute {
    product: string | Types.ObjectId | IProduct
    assets: string[] | Types.ObjectId[] | IAsset[]
    attribute: string | Types.ObjectId | IAttribute
    value: string
    amount: number
}
