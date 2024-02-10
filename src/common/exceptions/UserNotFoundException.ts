import { IException } from "@/interface"

export class UserNotFoundException extends Error implements IException {
    statusCode: number
    toJSON(): { statusCode: number; message: string } {
        return {
            statusCode: this.statusCode,
            message: this.message
        }
    }

    constructor(message: string = "User not found") {
        super(message)
        this.name = "UserNotFoundException"
        this.statusCode = 404
    }
}
