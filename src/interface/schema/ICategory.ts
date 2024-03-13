import { Types } from "mongoose"
import { IAsset } from "./IAsset"

export interface ICategory {
    name: string
    slug: string
    description: string
    deletedAt: Date
    image: string | Types.ObjectId | IAsset
}
