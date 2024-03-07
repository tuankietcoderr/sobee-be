import { IRole, IStaff, IUser } from "@/interface"

type CreateStaffRequest = Omit<IUser, "user"> & IStaff

type CreateStaffResponse = IUser<IStaff>

export { CreateStaffRequest, CreateStaffResponse }
