import { IRole } from "@/interface"
import { RoleRepository } from "./role.repository"
import { Role } from "@/models"

export class RoleService implements RoleRepository {
    async create(req: IRole): Promise<IRole> {
        return await Role.create(req)
    }
    async getAll(): Promise<IRole[]> {
        return await Role.find()
    }
}
