import { IProduct } from "@/interface"
import { CreateProductRequest } from "./dto"
import { ProductRepository } from "./product.repository"

export class ProductService implements ProductRepository {
    create(req: CreateProductRequest): Promise<IProduct> {
        throw new Error("Method not implemented.")
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
    getById(id: string): Promise<IProduct> {
        throw new Error("Method not implemented.")
    }
    getBySlug(slug: string): Promise<IProduct> {
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
