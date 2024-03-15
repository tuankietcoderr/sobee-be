import { IAddress } from "@/interface"
import { AddressRepository } from "./address.repository"
import { Address } from "@/models"
import { ObjectModelNotFoundException, UnauthorizedException } from "@/common/exceptions"
import { ERole } from "@/enum"
import { DeleteResult } from "mongodb"

export class AddressService implements AddressRepository {
    async create(req: IAddress): Promise<IAddress> {
        return await Address.create(req)
    }
    async update(id: string, data: Partial<IAddress>, requestId: string, role: string): Promise<IAddress> {
        const updated = await Address.findByIdAndUpdate(id, { $set: data })
        if (!updated) throw new ObjectModelNotFoundException("Address not found")
        if (updated.customer.toString() !== requestId && role === ERole.CUSTOMER)
            throw new UnauthorizedException("You are not authorized to update this address")
        return updated
    }
    async delete(id: string, requestId: string, role: string): Promise<DeleteResult> {
        const deleted = await Address.findById(id)
        if (!deleted) throw new ObjectModelNotFoundException("Address not found")
        if (deleted.customer.toString() !== requestId && role === ERole.CUSTOMER)
            throw new UnauthorizedException("You are not authorized to delete this address")

        return deleted.deleteOne()
    }
    async getCustomerAddresses(customerId: string, requestId: string, role: string): Promise<IAddress[]> {
        if (customerId !== requestId && role === ERole.CUSTOMER)
            throw new UnauthorizedException("You are not authorized to get this address")
        const addresses = await Address.find({ customer: customerId })
        return addresses
    }
}
