import { IAsset } from "@/interface"
import { Types } from "mongoose"
import { Multer } from "multer"

type CreateAssetRequest = {
    file: Express.Multer.File
}

type CreateAssetResponse = IAsset & {
    _id: Types.ObjectId | string
}

export { CreateAssetRequest, CreateAssetResponse }
