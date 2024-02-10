import { Schema, Types, model } from "mongoose"
import { IUser } from "@/interface"
import { SCHEMA_NAME } from "./schema-name"

const UserSchema = new Schema<IUser>(
    {
        avatar: {
            type: String
        },
        email: {
            type: String,
            required: true
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            required: true
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: SCHEMA_NAME.ROLES
        },
        username: {
            type: String,
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export default model<IUser>(SCHEMA_NAME.USERS, UserSchema, SCHEMA_NAME.USERS)
