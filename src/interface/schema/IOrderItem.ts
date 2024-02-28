import { Types } from "mongoose"
import { IOrder } from "./IOrder"
import { IProduct } from "./IProduct"

export interface IOrderItem {
    product: Types.ObjectId | IProduct | string
    quantity: number
}
