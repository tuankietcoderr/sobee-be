import { IRole } from "@/interface"
import { Schema, model } from "mongoose"
import { SCHEMA_NAME } from "./schema-name"
import { ESTAFF_PERMISSIONS } from "@/common/utils"

const RoleSchema = new Schema<IRole>(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        permissions: {
            type: [String],
            required: true
        }
    },
    {
        versionKey: false
    }
)

export default model<IRole>(SCHEMA_NAME.ROLES, RoleSchema, SCHEMA_NAME.ROLES)
