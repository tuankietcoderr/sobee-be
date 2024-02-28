import { Types } from "mongoose"
import { IAsset } from "./IAsset"

export interface ICategory {
    name: string
    slug: string
    description: string
    parentId: string | Types.ObjectId | ICategory
    deletedAt: Date
    image: string | Types.ObjectId | IAsset
}
