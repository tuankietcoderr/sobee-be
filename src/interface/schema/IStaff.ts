import { Types } from "mongoose"
import { IRole } from "./IRole"

export interface IStaff {
    identityCard: string
    staffRole: Types.ObjectId | string | IRole
}
