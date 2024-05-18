import { IVariant } from "@/interface"
import { CreateVariantRequest, CreateVariantResponse } from "./dto"

export abstract class VariantRepository {
    abstract create(req: CreateVariantRequest): Promise<CreateVariantResponse>
    abstract update(id: string, data: Partial<IVariant>): Promise<IVariant>
    abstract delete(id: string): Promise<IVariant>
    abstract getAll(): Promise<IVariant[]>
    abstract getByProduct(id: string): Promise<IVariant[]>
    abstract getById(id: string): Promise<IVariant>
}
