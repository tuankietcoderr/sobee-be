import { IPaymentMethod } from "@/interface"

type UpdatePaymentMethodRequest = Partial<IPaymentMethod>

type UpdatePaymentMethodResponse = IPaymentMethod

export { UpdatePaymentMethodRequest, UpdatePaymentMethodResponse }
