import { IPaymentMethod } from "@/interface"
import {
  CreatePaymentMethodRequest,
  CreatePaymentMethodResponse,
  UpdatePaymentMethodRequest,
  UpdatePaymentMethodResponse
} from "./dto"
import { DeleteResult } from "mongodb"

export abstract class PaymentMethodRepository {
  abstract create(data: CreatePaymentMethodRequest): Promise<CreatePaymentMethodResponse>
  abstract getAll(): Promise<Array<CreatePaymentMethodResponse>>
  abstract getOne<T = string>(key: string, value: T): Promise<IPaymentMethod>
  abstract update(id: string, data: UpdatePaymentMethodRequest): Promise<UpdatePaymentMethodResponse>
  abstract delete(id: string): Promise<DeleteResult>
}
