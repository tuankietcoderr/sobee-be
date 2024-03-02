import { IProduct } from "@/interface"
import { CreateProductRequest } from "./dto"
import { ProductRepository } from "./product.repository"
import { CategoryService } from "../category"
import { Product } from "@/models"

export class ProductService implements ProductRepository {
    private readonly categoryService = new CategoryService()
    async create(req: CreateProductRequest): Promise<IProduct> {
        const { productAssetAttributes, category } = req
        const _category = await this.categoryService.getBy("id", category.toString())
        const product = await Product.create(req)
        return product
    }
    update(id: string, data: Partial<IProduct>): Promise<IProduct> {
        throw new Error("Method not implemented.")
    }
    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.")
    }
    getAll(): Promise<IProduct[]> {
        throw new Error("Method not implemented.")
    }
    getBy(type: string, id: string): Promise<IProduct[]> {
        throw new Error("Method not implemented.")
    }
    search(query: string): Promise<IProduct[]> {
        throw new Error("Method not implemented.")
    }
    getSold(): Promise<IProduct[]> {
        throw new Error("Method not implemented.")
    }
    getDeleted(): Promise<IProduct[]> {
        throw new Error("Method not implemented.")
    }
    getActive(): Promise<IProduct[]> {
        throw new Error("Method not implemented.")
    }
    getFeatured(): Promise<IProduct[]> {
        throw new Error("Method not implemented.")
    }
    getRelated(id: string): Promise<IProduct[]> {
        throw new Error("Method not implemented.")
    }
    getBestSeller(): Promise<IProduct[]> {
        throw new Error("Method not implemented.")
    }
    getNewArrival(): Promise<IProduct[]> {
        throw new Error("Method not implemented.")
    }
    getPopular(): Promise<IProduct[]> {
        throw new Error("Method not implemented.")
    }
    getDiscounted(): Promise<IProduct[]> {
        throw new Error("Method not implemented.")
    }
}
