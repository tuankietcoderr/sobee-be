import { NextFunction, Request, Response } from "express"

export interface IMiddleware {
    verifyToken: (req: Request, res: Response, next: NextFunction) => void
    doNotAllowFields: <T>(...fields: Array<keyof T>) => (req: Request, res: Response, next: NextFunction) => void
    mustHaveFields: <T>(...fields: Array<keyof T>) => (req: Request, res: Response, next: NextFunction) => void
}
