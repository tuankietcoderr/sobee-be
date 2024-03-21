import { EProductStatus } from "@/enum"
import { Types } from "mongoose"
import { ICategory } from "./ICategory"
import { IProductAssetAttribute } from "./IProductAssetAttribute"

export interface IProduct {
    category: Types.ObjectId | ICategory | string
    name: string
    slug: string
    description: string
    price: number
    discount: number
    quantity: number
    sold: number
    status: EProductStatus
    favoritesCount: number
    productAssetAttributes: string[] | Types.ObjectId[] | IProductAssetAttribute[]
    isFeatured: boolean
    deletedAt: Date
}
