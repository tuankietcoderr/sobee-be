import { Types } from "mongoose"
import { IChatMessage } from "./IChatMessage"
import { IUser } from "./IUser"

export interface IChatRoom {
    messages: string[] | Types.ObjectId[] | IChatMessage[]
    title: string
    createdBy: string | Types.ObjectId | IUser
    users: string[] | Types.ObjectId[] | IUser[]
}
