import { IAttribute } from "@/interface"
import { Schema, model } from "mongoose"
import { SCHEMA_NAME } from "./schema-name"

const AttributeSchema = new Schema<IAttribute>(
    {
        description: String,
        name: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        versionKey: false
    }
)

export default model<IAttribute>(SCHEMA_NAME.ATTRIBUTES, AttributeSchema, SCHEMA_NAME.ATTRIBUTES)
