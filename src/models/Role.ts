import { IPermission, IRole } from "@/interface"
import { Schema, model } from "mongoose"
import { SCHEMA_NAME } from "./schema-name"
import { ESTAFF_PERMISSIONS } from "@/common/utils"
import { ERolePermissions } from "@/common/utils/rbac"

// const grantList = [
//     {role: 'admin', resource:'profile', action:'update:any', attributes:'*'},
//     {role: 'admin', resource:'balance', action:'update:any', attributes:'*, !mount'},

//     {role: 'shop', resource:'profile', action:'update:own', attributes:'*'},
//     {role: 'shop', resource:'balance', action:'update:own', attributes:'*, !mount'},

//     {role: 'user', resource:'profile', action:'update:own', attributes:'*'},
//     {role: 'user', resource:'balance', action:'update:own', attributes:'*'}
// ]
const RoleSchema = new Schema<IPermission>(
    {
        role: {
            type: String,
            required: true
        },
        resource: {
            type: String,
            required: true
        },
        action: {
            type: String,
            required: true,
            enum: ERolePermissions
        },
        attributes: {
            type: String,
            required: true,
            default: "*"
        }
    },
    {
        versionKey: false
    }
)

export default model<IPermission>(SCHEMA_NAME.ROLES, RoleSchema, SCHEMA_NAME.ROLES)
