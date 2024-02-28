import { IPermission } from "@/interface"
import { Schema, model } from "mongoose"
import { SCHEMA_NAME } from "./schema-name"

const PermissionSchema = new Schema<IPermission>({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

export default model<IPermission>(SCHEMA_NAME.PERMISSIONS, PermissionSchema, SCHEMA_NAME.PERMISSIONS)
