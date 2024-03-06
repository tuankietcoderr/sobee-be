import { IProductAssetAttribute } from "@/interface"
import { CreateProductAssetAttributeRequest, CreateProductAssetAttributeResponse } from "./dto"

export abstract class ProductAssetAttributeRepository {
    abstract create(req: CreateProductAssetAttributeRequest): Promise<CreateProductAssetAttributeResponse>
    abstract update(id: string, data: Partial<IProductAssetAttribute>): Promise<IProductAssetAttribute>
    abstract delete(id: string): Promise<IProductAssetAttribute>
    abstract getAll(): Promise<IProductAssetAttribute[]>
    abstract getByProduct(id: string): Promise<IProductAssetAttribute[]>
    abstract getById(id: string): Promise<IProductAssetAttribute>
}
