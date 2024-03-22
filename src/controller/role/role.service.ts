import { IPermission, IRole } from "@/interface"
import { RoleRepository } from "./role.repository"
import { Role } from "@/models"
import { ObjectModelOperationException } from "@/common/exceptions"

export class RoleService implements RoleRepository {
    async create(req: IPermission): Promise<IPermission> {
        const foundRole = await Role.find({ role: req.role, resource: req.resource, action: req.action }).lean()
        if (foundRole.length > 0) throw new ObjectModelOperationException("Role already exists")
        return await Role.create(req)
    }
    async getAll(): Promise<IPermission[]> {
        return await Role.find({}, { _id: 0 }).lean()
    }
    async getListRoleName(): Promise<string[]> {
        const roleName = await Role.aggregate([
            {
                $project: {
                    role: 1,
                    _id: 0
                }
            },
            {
                $group: {
                    _id: null,
                    roles: {
                        $addToSet: "$role"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    roles: 1
                }
            }
        ])

        return roleName.length > 0 ? roleName[0].roles : []
    }
}
