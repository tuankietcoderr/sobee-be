import { IVariant } from "@/interface"
import { VariantRepository } from "./variant.repository"
import { Variant } from "@/models"
import { ObjectModelNotFoundException, ObjectModelOperationException } from "@/common/exceptions"
import { AttributeService } from "../attribute"
import { ProductService } from "../product"
import { CreateVariantRequest, CreateVariantResponse } from "./dto"

export class VariantService implements VariantRepository {
    async create(req: CreateVariantRequest): Promise<CreateVariantResponse> {
        const { amount, attributeList } = req

        if (!attributeList || attributeList.length === 0) {
            throw new ObjectModelOperationException("Product variant must have at least one attribute")
        }

        if (amount <= 0) {
            throw new ObjectModelOperationException("Product variant amount must be greater than 0")
        }

        const variant = await Variant.create(req)
        return variant
    }
    async update(id: string, data: Partial<IVariant>): Promise<IVariant> {
        const updated = await Variant.findByIdAndUpdate(id, { $set: data })
        if (!updated) throw new ObjectModelNotFoundException()
        return updated
    }
    async delete(id: string): Promise<IVariant> {
        const deleted = await Variant.findByIdAndDelete(id)
        if (!deleted) throw new ObjectModelNotFoundException()
        return deleted
    }
    async getAll(): Promise<IVariant[]> {
        const variants = await Variant.find()
        return variants
    }

    async getByProduct(id: string): Promise<IVariant[]> {
        const variants = await Variant.find({ product: id })
        return variants
    }

    async getById(id: string): Promise<IVariant> {
        const variant = await Variant.findById(id)
        if (!variant) throw new ObjectModelNotFoundException()
        return variant
    }
}
