import { Types } from "mongoose"
import { IPermission } from "./IPermission"

export interface IStaff {
    identityCard: string
    role: Types.ObjectId | string
}
