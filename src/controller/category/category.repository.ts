import { ICategory } from "@/interface"
import { CreateCategoryRequest, CreateCategoryResponse } from "./dto"

export abstract class CategoryRepository {
    abstract create(req: CreateCategoryRequest): Promise<CreateCategoryResponse>
    abstract update(id: string, data: Partial<ICategory>): Promise<ICategory>
    abstract delete(id: string): Promise<ICategory>
    abstract getAll(): Promise<Array<ICategory>>
    abstract getBy(type: string, id: string): Promise<ICategory>
}
