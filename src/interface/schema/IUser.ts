import { Types } from "mongoose"
import { IRole } from "./IRole"

export interface IUser {
    username: string
    password?: string
    role: Types.ObjectId | IRole
    name: string
    avatar?: string
    email: string
    isEmailVerified?: boolean
}
