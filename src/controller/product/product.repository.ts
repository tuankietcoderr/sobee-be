import { IProduct } from "@/interface"
import { CreateProductRequest, CreateProductResponse } from "./dto"

export abstract class ProductRepository {
    abstract create(req: CreateProductRequest): Promise<CreateProductResponse>
    abstract update(id: string, data: Partial<IProduct>): Promise<IProduct>
    abstract delete(id: string): Promise<void>
    abstract getAll(): Promise<Array<IProduct>>
    abstract getBy(type: string, id: string): Promise<Array<IProduct>>
    abstract search(query: string): Promise<Array<IProduct>>
    abstract getSold(): Promise<Array<IProduct>>
    abstract getDeleted(): Promise<Array<IProduct>>
    abstract getActive(): Promise<Array<IProduct>>
    abstract getFeatured(): Promise<Array<IProduct>>
    abstract getRelated(id: string): Promise<Array<IProduct>>
    abstract getBestSeller(): Promise<Array<IProduct>>
    abstract getNewArrival(): Promise<Array<IProduct>>
    abstract getPopular(): Promise<Array<IProduct>>
    abstract getDiscounted(): Promise<Array<IProduct>>
}
