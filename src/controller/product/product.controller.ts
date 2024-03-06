import { IProduct, IRoute } from "@/interface"
import { Request, Response, Router } from "express"
import { ProductService } from "./product.service"
import { ErrorResponse, SuccessfulResponse } from "@/common/utils"
import { HttpStatusCode } from "@/common/utils"
import middleware from "@/common/middleware"
import { ERole } from "@/enum"

/**
 * @swagger
 * components:
 *  schemas:
 *    Product:
 *      type: object
 *      required:
 *          - category
 *          - name
 *          - price
 *          - quantity
 *      properties:
 *          _id:
 *              type: string
 *              description: The auto-generated id of the product
 *
 */
export class ProductController implements IRoute {
    private readonly router: Router
    private readonly path: string

    private readonly PATHS = {
        ROOT: "/",
        PRODUCT: "/:productId",
        GET_BY: "/:type/:productId", // type: slug, id, category
        POPULAR: "/popular",
        DISCOUNTED: "/discounted",
        FEATURED: "/featured",
        BEST_SELLER: "/best-seller"
    }

    private static readonly productService = new ProductService()

    constructor(path = "/api/product") {
        this.router = Router()
        this.path = path
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(
            this.PATHS.ROOT,
            middleware.verifyToken,
            middleware.verifyRoles(ERole.ADMIN, ERole.STAFF),
            middleware.mustHaveFields<IProduct>(
                "category",
                "name",
                "price",
                "quantity",
                "description",
                "productAssetAttributes",
                "slug"
            ),
            this.createProduct
        )
        this.router.put(
            this.PATHS.PRODUCT,
            middleware.verifyParams("productId"),
            middleware.verifyToken,
            middleware.verifyRoles(ERole.ADMIN, ERole.STAFF),
            this.updateProduct
        )
        this.router.delete(
            this.PATHS.PRODUCT,
            middleware.verifyParams("productId"),
            middleware.verifyToken,
            middleware.verifyRoles(ERole.ADMIN, ERole.STAFF),
            this.deleteProduct
        )

        this.router.get(this.PATHS.GET_BY, middleware.verifyParams("productId", "type"), this.getProductBy)

        this.router.get(this.PATHS.ROOT, this.getProducts)

        this.router.get(this.PATHS.POPULAR, this.getPopularProducts)

        this.router.get(this.PATHS.DISCOUNTED, this.getDiscountedProducts)

        this.router.get(this.PATHS.FEATURED, this.getFeaturedProducts)

        this.router.get(this.PATHS.BEST_SELLER, this.getBestSellerProducts)
    }

    /**
    @swagger
     * tags:
     *      name: Product
     *      description: Product management
     * /api/product:
     *      post:
     *          tags: [Product]
     *          summary: Create a new product
     *          description: Create a new product
     *          security:
     *             - bearerAuth: []
     *          requestBody:
     *              required: true
     *              content:
     *                  multipart/form-data:
     *                      schema:
     *                          $ref: '#/components/schemas/Product'
     *          responses:
     *              201:
     *                  description: Create product successfully
     *                  content:
     *                      application/json:
     *                          schema:
     *                              $ref: '#/components/schemas/Product'
     *              500:
     *                  description: Internal server error
     */
    private async createProduct(req: Request, res: Response) {
        try {
            const response = await ProductController.productService.create(req.body)
            new SuccessfulResponse(response, HttpStatusCode.CREATED, "Create product successfully").from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message).from(res)
        }
    }

    private async updateProduct(req: Request, res: Response) {
        try {
            const { productId } = req.params
            const response = await ProductController.productService.update(productId, req.body)
            new SuccessfulResponse(response, HttpStatusCode.OK, "Update product successfully").from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message).from(res)
        }
    }

    private async deleteProduct(req: Request, res: Response) {
        try {
            const { productId } = req.params
            const response = await ProductController.productService.delete(productId)
            new SuccessfulResponse(response, HttpStatusCode.OK, "Delete product successfully").from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message).from(res)
        }
    }

    private async getProductBy(req: Request, res: Response) {
        try {
            const { productId, type } = req.params
            const response = await ProductController.productService.getBy(type, productId)
            new SuccessfulResponse(response, HttpStatusCode.OK, "Get product successfully").from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message).from(res)
        }
    }

    private async getProducts(req: Request, res: Response) {
        try {
            const response = await ProductController.productService.getAll()
            new SuccessfulResponse(response, HttpStatusCode.OK, "Get products successfully").from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message).from(res)
        }
    }

    private async getPopularProducts(req: Request, res: Response) {
        try {
            const response = await ProductController.productService.getPopular()
            new SuccessfulResponse(response, HttpStatusCode.OK, "Get popular products successfully").from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message).from(res)
        }
    }

    private async getDiscountedProducts(req: Request, res: Response) {
        try {
            const response = await ProductController.productService.getDiscounted()
            new SuccessfulResponse(response, HttpStatusCode.OK, "Get discounted products successfully").from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message).from(res)
        }
    }

    private async getBestSellerProducts(req: Request, res: Response) {
        try {
            const response = await ProductController.productService.getBestSeller()
            new SuccessfulResponse(response, HttpStatusCode.OK, "Get best seller products successfully").from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message).from(res)
        }
    }

    private async getFeaturedProducts(req: Request, res: Response) {
        try {
            const response = await ProductController.productService.getFeatured()
            new SuccessfulResponse(response, HttpStatusCode.OK, "Get featured products successfully").from(res)
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
