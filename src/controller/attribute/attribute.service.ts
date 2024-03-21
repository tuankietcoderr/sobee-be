import { IAttribute } from "@/interface"
import { AttributeRepository } from "./attribute.repository"
import { Attribute } from "@/models"
import { ObjectModelNotFoundException } from "@/common/exceptions"

export class AttributeService implements AttributeRepository {
    async create(req: IAttribute): Promise<IAttribute> {
        return await Attribute.create(req)
    }
    async update(id: string, data: Partial<IAttribute>): Promise<IAttribute> {
        const updated = await Attribute.findByIdAndUpdate(id, { $set: data }, { new: true })
        if (!updated) throw new ObjectModelNotFoundException()
        return updated
    }
    async delete(id: string): Promise<IAttribute> {
        const deleted = await Attribute.findByIdAndDelete(id)
        if (!deleted) throw new ObjectModelNotFoundException()
        return deleted
    }
    async getAll(): Promise<IAttribute[]> {
        const attributes = await Attribute.find()
        return attributes
    }
    async getById(id: string): Promise<IAttribute> {
        const attribute = await Attribute.findById(id)
        if (!attribute) throw new ObjectModelNotFoundException()
        return attribute
    }
}
