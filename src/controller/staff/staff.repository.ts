import { IStaff } from "@/interface"
import { CreateStaffRequest, CreateStaffResponse } from "./dto"

export abstract class StaffRepository {
    abstract create(req: CreateStaffRequest): Promise<CreateStaffResponse>
    abstract update(staffId: string, req: IStaff): Promise<IStaff>
}
