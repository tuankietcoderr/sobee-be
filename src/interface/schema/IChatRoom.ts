import { Types } from "mongoose"
import { IChatMessage } from "./IChatMessage"

export interface IChatRoom {
    messages: string[] | Types.ObjectId[] | IChatMessage[]
    title: string
}
