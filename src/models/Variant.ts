import { IVariant } from "@/interface"
import { Schema, model } from "mongoose"
import { SCHEMA_NAME } from "./schema-name"

const Variant = new Schema<IVariant>(
    {
        amount: {
            type: Number,
            default: 0
        },
        assets: [
            {
                type: String
            }
        ],
        price: {
            type: Number,
            required: true
        },
        attributeList: [
            {
                attribute: {
                    ref: SCHEMA_NAME.ATTRIBUTES,
                    type: Schema.Types.ObjectId
                },
                value: {
                    type: String
                }
            }
        ]
    },
    {
        versionKey: false
    }
)

export default model<IVariant>(SCHEMA_NAME.VARIANTS, Variant, SCHEMA_NAME.VARIANTS)
