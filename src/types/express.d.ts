import "express"
import { TFunction } from "i18next"

declare module "express" {
    export interface Request {
        userId: string
        role: string
        t: TFunction<"translation", undefined>
    }
}
