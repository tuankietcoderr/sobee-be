import { IAddress } from "@/interface"
import { CreateAddressRequest, CreateAddressResponse } from "./dto"

export abstract class AddressRepository {
    abstract create(req: CreateAddressRequest): Promise<CreateAddressResponse>
    abstract update(id: string, data: Partial<IAddress>): Promise<IAddress>
    abstract delete(id: string): Promise<IAddress>
    abstract getCustomerAddresses(customerId: string): Promise<IAddress[]>
}
