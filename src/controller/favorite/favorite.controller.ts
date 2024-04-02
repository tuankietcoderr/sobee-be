import { IFavorite, IRoute } from "@/interface"
import { FavoriteService } from "./favorite.service"
import { Request, Response, Router } from "express"
import middleware from "@/common/middleware"
import { ErrorResponse, HttpStatusCode, SuccessfulResponse } from "@/common/utils"
import { asyncHandler } from "@/common/utils"

export class FavoriteController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {
        FAVORITE: "/",
        UNFAVORITE: "/unfavorite",
        GET_FAVORITES: "/get-favorites",
        REMOVE_ALL: "/remove-all"
    }

    private static readonly favoriteService = new FavoriteService()

    constructor(path = "/api/favorite") {
        this.router = Router()
        this.path = path
        this.router.use(middleware.verifyToken)
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(this.PATHS.FAVORITE, middleware.mustHaveFields("product"), asyncHandler(this.favoriteProduct))
        this.router.post(
            this.PATHS.UNFAVORITE,
            middleware.mustHaveFields("product"),
            asyncHandler(this.unfavoriteProduct)
        )
        this.router.get(this.PATHS.GET_FAVORITES, asyncHandler(this.getFavorites))
        this.router.delete(this.PATHS.REMOVE_ALL, asyncHandler(this.removeAllFavoriteProducts))
    }

    getPath(): string {
        return this.path
    }

    getRouter(): Router {
        return this.router
    }

    private async favoriteProduct(req: Request, res: Response): Promise<void> {
        const data = await FavoriteController.favoriteService.favoriteProduct(req.userId, req.body.product)
        new SuccessfulResponse(data, HttpStatusCode.OK, "Product favorited successfully").from(res)
    }

    private async unfavoriteProduct(req: Request, res: Response): Promise<void> {
        const data = await FavoriteController.favoriteService.unfavoriteProduct(req.userId, req.body.product)
        new SuccessfulResponse(data, HttpStatusCode.OK, "Product unfavorited successfully").from(res)
    }

    private async getFavorites(req: Request, res: Response): Promise<void> {
        const data = await FavoriteController.favoriteService.getFavorites(req.userId)
        new SuccessfulResponse(data, HttpStatusCode.OK, "Favorites retrieved successfully").from(res)
    }

    private async removeAllFavoriteProducts(req: Request, res: Response): Promise<void> {
        const data = await FavoriteController.favoriteService.removeAllFavoriteProducts(req.userId)
        new SuccessfulResponse(data, HttpStatusCode.OK, "All favorite products removed successfully").from(res)
    }
}
