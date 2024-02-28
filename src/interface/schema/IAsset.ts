import { EAssetType } from "@/enum"

export interface IAsset {
    filename: string
    urlPath: string
    type: EAssetType
    size: number
}
