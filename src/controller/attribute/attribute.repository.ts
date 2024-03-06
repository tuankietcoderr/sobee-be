import { IAttribute } from "@/interface"
import { CreateAttributeRequest, CreateAttributeResponse } from "./dto"

export abstract class AttributeRepository {
    abstract create(req: CreateAttributeRequest): Promise<CreateAttributeResponse>
    abstract update(id: string, data: Partial<IAttribute>): Promise<IAttribute>
    abstract delete(id: string): Promise<IAttribute>
    abstract getAll(): Promise<IAttribute[]>
    abstract getById(id: string): Promise<IAttribute>
}
