// const grantList = [
//     {role: 'admin', resource:'profile', action:'update:any', attributes:'*'},
//     {role: 'admin', resource:'balance', action:'update:any', attributes:'*, !mount'},

import { ERolePermissions } from "@/common/utils/rbac"

//     {role: 'shop', resource:'profile', action:'update:own', attributes:'*'},
//     {role: 'shop', resource:'balance', action:'update:own', attributes:'*, !mount'},

//     {role: 'user', resource:'profile', action:'update:own', attributes:'*'},
//     {role: 'user', resource:'balance', action:'update:own', attributes:'*'}
// ]
export interface IPermission {
    role: string
    resource: string
    action: ERolePermissions
    attributes: string
}
