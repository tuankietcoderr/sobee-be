import { IPermission, IRole } from "@/interface"
import { CreateRoleRequest, CreateRoleResponse } from "./dto"

export abstract class RoleRepository {
    abstract create(req: IPermission): Promise<IPermission>
    abstract getAll(): Promise<Array<IPermission>>
}
