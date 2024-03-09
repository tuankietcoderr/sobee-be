import { ICustomer, IUser } from "@/interface"

export interface RegisterRequest extends Omit<IUser, "user"> {}

export type RegisterResponse = {
    accessToken: string
    refreshToken: string
    user: IUser
}
