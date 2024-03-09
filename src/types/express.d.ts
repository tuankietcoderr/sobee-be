import "express"
import { TFunction } from "i18next"
import { IKeyToken } from "@/interface/schema"

declare module "express" {
    export interface Request {
        userId: string
        role: string
        keyToken: IKeyToken
        t: TFunction<"translation", undefined>
    }
}
