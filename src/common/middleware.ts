import { IMiddleware } from "@/interface"
import { User } from "@/models"
import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { ErrorResponse } from "./utils"

class Middleware implements IMiddleware {
    async verifyToken(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.cookie?.split("accessToken=")[1]?.split(";")[0]

        if (!token) {
            return new ErrorResponse(401, "Access denied. No token provided").from(res)
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload

            req.userId = decoded.userId

            const user = await User.findById(decoded.userId)
            if (!user) {
                return new ErrorResponse(401, "Invalid token").from(res)
            }
            next()
        } catch {
            return new ErrorResponse(403, "Invalid token").from(res)
        }
    }

    doNotAllowFields<T = string>(...fields: (keyof T)[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            const body = req.body

            for (const field of fields) {
                if (body[field]) {
                    return new ErrorResponse(400, `Field ${String(field)} is not allowed`).from(res)
                }
            }

            next()
        }
    }

    mustHaveFields<T>(...fields: (keyof T)[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            const body = req.body
            const leftFields = [] as string[]
            for (const field of fields) {
                if (body[field] === undefined) {
                    leftFields.push(field as string)
                }
            }

            if (leftFields.length > 0) {
                return new ErrorResponse(400, `Missing fields: ${leftFields.join(", ")}`).from(res)
            }

            next()
        }
    }
}

export default new Middleware()
