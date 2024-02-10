import { IException } from "@/interface"

class UnauthorizedException extends Error implements IException {
    statusCode: number

    toJSON(): { statusCode: number; message: string } {
        return {
            statusCode: this.statusCode,
            message: this.message
        }
    }

    constructor(message: string = "Unauthorized") {
        super(message)
        this.name = "UnauthorizedException"
        this.statusCode = 401
    }
}

export { UnauthorizedException }
