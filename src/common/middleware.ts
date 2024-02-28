import { IMiddleware } from "@/interface"
import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { ErrorResponse } from "./utils"
import User from "@/models/User"
import HttpStatusCode from "./utils/http-status-code"

class Middleware implements IMiddleware {
    async verifyToken(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.header("Authorization")
        const token = authHeader && authHeader.split(" ")[1]

        if (!token) {
            return new ErrorResponse(HttpStatusCode.UNAUTHORIZED, "Access denied. No token provided").from(res)
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload

            req.userId = decoded.userId
            req.role = decoded.role

            const user = await User.findById(decoded.userId)
            if (!user) {
                return new ErrorResponse(HttpStatusCode.UNAUTHORIZED, "Invalid token").from(res)
            }
            next()
        } catch {
            return new ErrorResponse(HttpStatusCode.FORBIDDEN, "Invalid token").from(res)
        }
    }

    doNotAllowFields<T = string>(...fields: (keyof T)[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            const body = req.body

            for (const field of fields) {
                if (body[field]) {
                    return new ErrorResponse(HttpStatusCode.BAD_REQUEST, `Field ${String(field)} is not allowed`).from(
                        res
                    )
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
                return new ErrorResponse(HttpStatusCode.BAD_REQUEST, `Missing fields: ${leftFields.join(", ")}`).from(
                    res
                )
            }

            next()
        }
    }
}

export default new Middleware()
