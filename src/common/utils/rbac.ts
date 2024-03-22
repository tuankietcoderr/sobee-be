import { Review } from "@/models"
import { AccessControl } from "accesscontrol"

export const ac = new AccessControl()

export enum EActionPermissions {
    CREATE = "create",
    CREATEANY = "createAny",
    CREATEOWN = "createOwn",
    READ = "read",
    READANY = "readAny",
    READOWN = "readOwn",
    UPDATE = "update",
    UPDATEANY = "updateAny",
    UPDATEOWN = "updateOwn",
    DELETE = "delete",
    DELETEANY = "deleteAny",
    DELETEOWN = "deleteOwn"
}

export enum ERolePermissions {
    CREATE = "create",
    CREATEANY = "create:any",
    CREATEOWN = "create:own",
    READ = "read",
    READANY = "read:any",
    READOWN = "read:own",
    UPDATE = "update",
    UPDATEANY = "update:any",
    UPDATEOWN = "update:own",
    DELETE = "delete",
    DELETEANY = "delete:any",
    DELETEOWN = "delete:own"
}

export enum EResourcePermissions {
    REVIEW = "REVIEW",
    PRODUCT = "PRODUCT",
    CATEGORY = "CATEGORY",
    ATTRIBUTE = "ATTRIBUTE",
    ASSET = "ASSET"
}

export const EResourceToModel = {
    REVIEW: Review
}
