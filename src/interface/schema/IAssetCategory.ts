import { Types } from "mongoose"
import { IAsset } from "./IAsset"

export interface IAssetCategory {
    assets: string[] | Types.ObjectId[] | IAsset[]
    name: string
}
