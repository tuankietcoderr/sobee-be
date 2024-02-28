import { IChatRoom } from "@/interface"
import { Schema, model } from "mongoose"
import { SCHEMA_NAME } from "./schema-name"

const ChatRoomSchema = new Schema<IChatRoom>(
    {
        messages: [
            {
                type: Schema.Types.ObjectId,
                ref: SCHEMA_NAME.CHAT_MESSAGES
            }
        ],
        title: {
            type: String,
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export default model<IChatRoom>(SCHEMA_NAME.CHAT_ROOMS, ChatRoomSchema, SCHEMA_NAME.CHAT_ROOMS)
