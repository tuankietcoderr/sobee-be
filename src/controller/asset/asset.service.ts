import { IAsset } from "@/interface"
import { AssetRepository } from "./asset.repository"
import { Asset } from "@/models"
import { CreateAssetRequest, CreateAssetResponse } from "./dto"
import { ObjectModelNotFoundException } from "@/common/exceptions"
import mime from "mime-types"
import { BUCKET_NAME, MinioStorage } from "@/common/utils"

export class AssetService implements AssetRepository {
    private static readonly minioStorage = MinioStorage.Instance

    async create(req: CreateAssetRequest): Promise<CreateAssetResponse> {
        const filename = req.file?.originalname as string
        const mimeType = req.file?.mimetype as string
        const size = req.file?.size as number
        const asset = new Asset({
            filename,
            mimeType,
            size
        })
        const uniqueFilename = asset._id.toString() + "." + mime.extension(mimeType)
        asset.urlPath = uniqueFilename
        await AssetService.minioStorage.uploadFile(BUCKET_NAME, req.file!, uniqueFilename)
        await asset.save()
        return asset
    }
    async delete(id: string): Promise<IAsset> {
        const asset = await Asset.findByIdAndDelete(id)
        if (!asset) throw new ObjectModelNotFoundException("Asset not found.")
        await AssetService.minioStorage.removeFile(BUCKET_NAME, asset.urlPath)
        return asset
    }

    async deleteMany(ids: string[]): Promise<IAsset[]> {
        const assets = await Asset.find({ _id: { $in: ids } })
        if (assets.length === 0) throw new ObjectModelNotFoundException("Asset not found.")
        await AssetService.minioStorage.removeFiles(
            BUCKET_NAME,
            assets.map((asset) => asset.urlPath)
        )
        await Asset.deleteMany({ _id: { $in: ids } })
        return assets
    }

    async getAll(): Promise<IAsset[]> {
        return await Asset.find()
    }
}
