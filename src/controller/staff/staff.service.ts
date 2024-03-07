import { Staff } from "@/models"
import { AuthService } from "../auth"
import { CreateStaffRequest, CreateStaffResponse } from "./dto"
import { StaffRepository } from "./staff.repository"
import { IStaff } from "@/interface"
import { ObjectModelNotFoundException } from "@/common/exceptions"

export class StaffService implements StaffRepository {
    private authService: AuthService

    constructor() {
        this.authService = new AuthService()
    }

    async create(req: CreateStaffRequest): Promise<CreateStaffResponse> {
        const { staffRole, identityCard, ...rest } = req
        const { user } = await this.authService.register(rest)
        const staffId = user.user.toString()

        await this.update(staffId, { staffRole, identityCard })

        return user as CreateStaffResponse
    }

    async update(staffId: string, req: IStaff): Promise<IStaff> {
        const staff = await Staff.findByIdAndUpdate(staffId, { $set: req }, { new: true })

        if (!staff) {
            throw new ObjectModelNotFoundException()
        }

        return staff
    }
}
