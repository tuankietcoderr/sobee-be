import { IPaymentMethod } from "@/interface"
import { DeleteResult } from "mongodb"
import { PaymentMethodRepository } from "./payment-method.repository"
import { PaymentMethod } from "@/models"
import { ObjectModelNotFoundException, ObjectModelOperationException } from "@/common/exceptions"
import { UpdatePaymentMethodRequest, UpdatePaymentMethodResponse } from "./dto"

export class PaymentMethodService implements PaymentMethodRepository {
  async create(data: IPaymentMethod): Promise<IPaymentMethod> {
    return await PaymentMethod.create(data)
  }
  async getAll(): Promise<IPaymentMethod[]> {
    return await PaymentMethod.find()
  }
  async getOne<T = string>(key: keyof IPaymentMethod, value: T): Promise<IPaymentMethod> {
    const paymentMethod = await PaymentMethod.findOne({ [key]: value })
    if (!paymentMethod) {
      throw new ObjectModelNotFoundException("PaymentMethod not found")
    }
    return paymentMethod
  }
  async update(id: string, data: UpdatePaymentMethodRequest): Promise<UpdatePaymentMethodResponse> {
    const paymentMethod = await PaymentMethod.findByIdAndUpdate(id, { $set: data }, { new: true })
    if (!paymentMethod) {
      throw new ObjectModelOperationException("PaymentMethod not found")
    }
    return paymentMethod
  }
  async delete(id: string): Promise<DeleteResult> {
    const paymentMethod = await PaymentMethod.findById(id)
    if (!paymentMethod) {
      throw new ObjectModelOperationException("PaymentMethod not found")
    }
    return await paymentMethod.deleteOne()
  }
}
