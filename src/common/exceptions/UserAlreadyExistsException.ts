import { IException } from "@/interface"

class UserAlreadyExistsException extends Error implements IException {
    statusCode: number

    toJSON(): { statusCode: number; message: string } {
        return {
            statusCode: this.statusCode,
            message: this.message
        }
    }

    constructor(message: string = "User's already exists") {
        super(message)
        this.name = "UserAlreadyExistsException"
        this.statusCode = 402
    }
}

export { UserAlreadyExistsException }
