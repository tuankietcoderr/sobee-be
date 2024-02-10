import { Response } from "express"

export interface IResponse<T> {
    success: boolean
    statusCode: number
    data?: T
    message?: string
}

export interface IFinalResponse<T> extends IResponse<T> {
    from(res: Response): void
}
