import { IRole } from "@/interface"
import { CreateRoleRequest, CreateRoleResponse } from "./dto"

export abstract class RoleRepository {
    abstract create(req: CreateRoleRequest): Promise<CreateRoleResponse>
    abstract getAll(): Promise<Array<IRole>>
}
