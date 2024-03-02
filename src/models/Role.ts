import { IRole } from "@/interface"
import { Schema, model } from "mongoose"
import { SCHEMA_NAME } from "./schema-name"

const RoleSchema = new Schema<IRole>(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        permissions: [
            {
                type: Schema.Types.ObjectId,
                ref: SCHEMA_NAME.PERMISSIONS
            }
        ]
    },
    {
        versionKey: false
    }
)

export default model<IRole>(SCHEMA_NAME.ROLES, RoleSchema, SCHEMA_NAME.ROLES)
