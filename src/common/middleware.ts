import { ERole } from "@/enum"
import { IMiddleware, IRole, IStaff } from "@/interface"
import User from "@/models/User"
import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { ESTAFF_PERMISSIONS, ErrorResponse, HttpStatusCode } from "./utils"
import KeyTokenService from "./utils/keyToken"

const HEADER = {
    AUTHORIZATION: "Authorization",
    CLIENTID: "x-client-id"
}

class Middleware implements IMiddleware {
    async verifyToken(req: Request, res: Response, next: NextFunction) {
        try {
            // console.log(req.header(HEADER.AUTHORIZATION))

            //check if client id is present in the header
            const clientId = req.header(HEADER.CLIENTID)

            if (!clientId) return new ErrorResponse(HttpStatusCode.BAD_REQUEST, "Missing client id").from(res)

            //check if the client id is present in the database
            const keyStore = await KeyTokenService.findbyUserId(clientId)
            if (!keyStore) return new ErrorResponse(HttpStatusCode.UNAUTHORIZED, "Not found keyStore").from(res)

            //check if the token is present in the header
            const authHeader = req.header(HEADER.AUTHORIZATION)
            const accessToken = authHeader && authHeader.split(" ")[1]

            if (!accessToken) {
                return new ErrorResponse(HttpStatusCode.UNAUTHORIZED, "Access denied. No token provided").from(res)
            }

            // const decoded = jwt.verify(accessToken, process.env.JWT_SECRET) as JwtPayload
            const decoded = jwt.verify(accessToken, keyStore.publicKey) as JwtPayload

            //check if the client id in the token is the same as the client id in the header
            if (clientId !== decoded.userId)
                return new ErrorResponse(HttpStatusCode.UNAUTHORIZED, "Invalid request").from(res)

            req.userId = decoded.userId
            req.role = decoded.role
            req.keyToken = keyStore

            const user = await User.findById(decoded.userId).lean()
            if (!user) {
                return new ErrorResponse(HttpStatusCode.UNAUTHORIZED, "Invalid token").from(res)
            }
            next()
        } catch (err) {
            console.log(err)

            return new ErrorResponse(HttpStatusCode.FORBIDDEN, "Invalid token").from(res)
        }
    }

    verifyRoles(...roles: string[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            console.log(req.role)
            if (!req.role) {
                return new ErrorResponse(HttpStatusCode.FORBIDDEN, "Access denied").from(res)
            }

            if (!roles.includes(req.role)) {
                return new ErrorResponse(HttpStatusCode.FORBIDDEN, "Access denied").from(res)
            }

            next()
        }
    }

    verifyParams(...params: string[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            for (const param of params) {
                if (!req.params[param]) {
                    return new ErrorResponse(HttpStatusCode.BAD_REQUEST, `Missing param: ${param}`).from(res)
                }
            }

            next()
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

    verifyStaffPermissions(...permissions: ESTAFF_PERMISSIONS[]) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const role = req.role
            if (!role) {
                return new ErrorResponse(HttpStatusCode.FORBIDDEN, "Access denied").from(res)
            }

            if (role === ERole.ADMIN) {
                return next()
            }

            const userId = req.userId

            const user = await User.findById(
                userId,
                {},
                {
                    populate: {
                        path: "user",
                        select: "staffRole",
                        populate: {
                            path: "staffRole",
                            select: "permissions"
                        }
                    }
                }
            )
            if (!user) {
                return new ErrorResponse(HttpStatusCode.NOT_FOUND, "User not found").from(res)
            }

            const staff = user.user as IStaff
            const staffRole = staff.staffRole as IRole
            const staffPermissions = staffRole.permissions

            for (const permission of permissions) {
                if (!staffPermissions.includes(permission)) {
                    return new ErrorResponse(HttpStatusCode.FORBIDDEN, "Access denied").from(res)
                }
            }

            next()
        }
    }
}

export default new Middleware()
