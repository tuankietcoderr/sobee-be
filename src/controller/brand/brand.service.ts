import { IBrand } from "@/interface"
import { BrandRepository } from "./brand.repository"
import { Brand } from "@/models"
import { ObjectModelNotFoundException } from "@/common/exceptions"

export class BrandService implements BrandRepository {
    async create(req: IBrand): Promise<IBrand> {
        return await Brand.create(req)
    }

    async update(id: string, req: Partial<IBrand>): Promise<IBrand> {
        const brand = await Brand.findByIdAndUpdate(id, { $set: req }, { new: true })
        if (!brand) throw new ObjectModelNotFoundException("Brand not found")
        return brand
    }

    async delete(id: string): Promise<IBrand> {
        const brand = await Brand.findByIdAndDelete(id)
        if (!brand) throw new ObjectModelNotFoundException("Brand not found")
        return brand
    }

    async findAll(): Promise<IBrand[]> {
        return await Brand.find().lean()
    }

    async findById(id: string): Promise<IBrand> {
        const brand = await Brand.findById(id).lean()
        if (!brand) throw new ObjectModelNotFoundException("Brand not found")
        return brand
    }
}
