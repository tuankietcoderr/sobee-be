import { IRoute } from "@/interface"
import { AssetService } from "./asset.service"
import { Request, Response, Router } from "express"
import {
    BUCKET_NAME,
    ErrorResponse,
    FIELD_NAME,
    HttpStatusCode,
    MinioStorage,
    SuccessfulResponse
} from "@/common/utils"
import Multer from "multer"
import middleware from "@/common/middleware"

export class AssetController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {
        ROOT: "/",
        ASSET: "/:assetId",
        RESOURCE: "/resource"
    }

    private static readonly assetService = new AssetService()
    private static readonly minioStorage = MinioStorage.Instance

    constructor(path = "/api/asset") {
        this.router = Router()
        this.path = path
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(
            this.PATHS.ROOT,
            middleware.verifyToken,
            Multer({ storage: Multer.memoryStorage() }).single(FIELD_NAME),
            this.createAsset
        )

        this.router.delete(this.PATHS.ASSET, middleware.verifyToken, this.deleteAsset)

        this.router.delete(
            this.PATHS.ROOT,
            middleware.verifyToken,
            middleware.mustHaveFields("assetIds"),
            this.deleteManyAsset
        )

        this.router.get(this.PATHS.ROOT, this.getAllAsset)

        this.router.get(this.PATHS.RESOURCE, middleware.verifyQuery("resourcePath"), this.getResource)
    }

    private async createAsset(req: Request, res: Response) {
        try {
            const asset = await AssetController.assetService.create({
                file: req.file!
            })

            new SuccessfulResponse(asset, HttpStatusCode.CREATED, "Asset create successfully!").from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message).from(res)
        }
    }

    private async deleteAsset(req: Request, res: Response) {
        try {
            const asset = await AssetController.assetService.delete(req.params.assetId)
            new SuccessfulResponse(asset, HttpStatusCode.OK, "Asset delete successfully!").from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message).from(res)
        }
    }

    private async deleteManyAsset(req: Request, res: Response) {
        try {
            const assets = await AssetController.assetService.deleteMany(req.body.assetIds)
            new SuccessfulResponse(assets, HttpStatusCode.OK, "Assets delete successfully!").from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message).from(res)
        }
    }

    private async getAllAsset(req: Request, res: Response) {
        try {
            const assets = await AssetController.assetService.getAll()
            new SuccessfulResponse(assets, HttpStatusCode.OK, "Asset fetch successfully!").from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message).from(res)
        }
    }

    private async getResource(req: Request, res: Response) {
        try {
            const file = await AssetController.minioStorage.getFile(BUCKET_NAME, req.query.resourcePath as string)
            file.pipe(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message).from(res)
        }
    }

    getPath(): string {
        return this.path
    }

    getRouter(): Router {
        return this.router
    }
}
