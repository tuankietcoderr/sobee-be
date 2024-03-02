import { IPermission } from "@/interface"
import { Types } from "mongoose"

export interface IRole {
    name: string
    permissions: string[] | IPermission[] | Types.ObjectId[]
}
