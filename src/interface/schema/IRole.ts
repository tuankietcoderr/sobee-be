import { ESTAFF_PERMISSIONS } from "@/common/utils"

export interface IRole {
    name: string
    permissions: ESTAFF_PERMISSIONS[]
}
