import { IUser } from "@/interface"

export interface MeRequest {
    userId: string
}
export interface MeResponse {
    user: IUser
}
