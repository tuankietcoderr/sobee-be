import { IProduct } from "@/interface"
import { CreateProductRequest, CreateProductResponse } from "./dto"
import { DeleteResult } from "mongodb"
export abstract class ProductRepository {
    abstract create(req: CreateProductRequest): Promise<CreateProductResponse>
    abstract update(id: string, data: Partial<IProduct>): Promise<IProduct>
    abstract delete(id: string): Promise<DeleteResult>
    abstract getPublishedProducts(): Promise<Array<IProduct>>
    abstract getDraftProducts(): Promise<Array<IProduct>>
    abstract getOne(type: string, id: string): Promise<IProduct>
    abstract getFeatured(): Promise<Array<IProduct>>
    abstract getRelated(id: string): Promise<Array<IProduct>>
    abstract getBestSeller(): Promise<Array<IProduct>>
    abstract getPopular(): Promise<Array<IProduct>>
    abstract getDiscounted(): Promise<Array<IProduct>>
}
