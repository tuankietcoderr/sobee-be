import { IAddress } from "@/interface"
import { AddressRepository } from "./address.repository"
import { Address } from "@/models"
import { ObjectModelNotFoundException } from "@/common/exceptions"

export class AddressService implements AddressRepository {
    async create(req: IAddress): Promise<IAddress> {
        return await Address.create(req)
    }
    async update(id: string, data: Partial<IAddress>): Promise<IAddress> {
        const updated = await Address.findByIdAndUpdate(id, { $set: data })
        if (!updated) throw new ObjectModelNotFoundException()
        return updated
    }
    async delete(id: string): Promise<IAddress> {
        const deleted = await Address.findByIdAndDelete(id)
        if (!deleted) throw new ObjectModelNotFoundException()
        return deleted
    }
    async getCustomerAddresses(customerId: string): Promise<IAddress[]> {
        const addresses = await Address.find({ customer: customerId })
        return addresses
    }
}
