import { Types } from "mongoose"
import { IPermission } from "./IPermission"
import { IRole } from "./IRole"

export interface IStaff {
    identityCard: string
    staffRole: Types.ObjectId | string | IRole
}
