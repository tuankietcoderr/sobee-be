import { IVariant } from "@/interface"

export abstract class VariantRepository {
    abstract create(req: IVariant): Promise<IVariant>
    abstract update(id: string, data: Partial<IVariant>): Promise<IVariant>
    abstract delete(id: string): Promise<IVariant>
    abstract getAll(): Promise<IVariant[]>
    abstract getByProduct(id: string): Promise<IVariant[]>
    abstract getById(id: string): Promise<IVariant>
}
