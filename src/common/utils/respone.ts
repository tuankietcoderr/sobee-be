import { IFinalResponse } from "@/interface"
import { Response } from "express"

class SuccessfulResponse<T> implements IFinalResponse<T> {
    success: boolean
    data: T
    statusCode: number
    message?: string
    constructor(data: T, statusCode: number = 200, message?: string) {
        this.data = data
        this.success = true
        this.statusCode = statusCode
        this.message = message
    }

    from(res: Response): void {
        res.status(this.statusCode).json({
            success: this.success,
            statusCode: this.statusCode,
            message: this.message,
            data: this.data
        })
    }
}

class ErrorResponse<T> extends Error implements IFinalResponse<T> {
    success: boolean
    statusCode: number
    message: string
    constructor(statusCode: number = 500, message: string) {
        super(message)
        this.success = false
        this.statusCode = statusCode
        this.message = message
    }

    from(res: Response): void {
        res.status(this.statusCode).json({
            success: this.success,
            statusCode: this.statusCode,
            message: this.message
        })
    }
}

export { SuccessfulResponse, ErrorResponse }
