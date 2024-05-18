import { Types } from "mongoose"
import { IAttribute } from "./IAttribute"

export interface IVariant {
    _id?: string | Types.ObjectId
    assets?: string[]
    amount: number
    price: number
    attributeList: IAttributeWithValue[]
}

export interface IAttributeWithValue {
    attribute: string | Types.ObjectId | IAttribute
    value: string
}
