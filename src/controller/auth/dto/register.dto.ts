import { IUser } from "@/interface"

export interface RegisterRequest extends Omit<IUser, "isEmailVerified"> {}

export interface RegisterResponse {
    accessToken: string
    user: IUser
}
