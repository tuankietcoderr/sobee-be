import { IAsset } from "@/interface"
import { AssetRepository } from "./asset.repository"
import { Asset } from "@/models"

export class AssetService implements AssetRepository {
    create(req: IAsset): Promise<IAsset> {
        throw new Error("Method not implemented.")
    }
    delete(id: string): Promise<IAsset> {
        throw new Error("Method not implemented.")
    }
    getAll(): Promise<IAsset[]> {
        throw new Error("Method not implemented.")
    }
}
