import { IAsset } from "@/interface"
import { CreateAssetRequest, CreateAssetResponse } from "./dto"

export abstract class AssetRepository {
    abstract create(req: CreateAssetRequest): Promise<CreateAssetResponse>
    abstract delete(id: string): Promise<IAsset>
    abstract getAll(): Promise<IAsset[]>
    abstract deleteMany(ids: string[]): Promise<IAsset[]>
}
