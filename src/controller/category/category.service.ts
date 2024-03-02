import { ICategory } from "@/interface"
import { CategoryRepository } from "./category.repository"
import { CreateCategoryRequest, CreateCategoryResponse } from "./dto"
import { Category } from "@/models"
import { ObjectModelNotFoundException, ObjectModelOperationException } from "@/common/exceptions"

export class CategoryService implements CategoryRepository {
    async create(req: CreateCategoryRequest): Promise<CreateCategoryResponse> {
        const category = await Category.create(req)
        if (!category) throw new ObjectModelOperationException()
        return category
    }
    update(id: string, data: Partial<ICategory>): Promise<ICategory> {
        throw new Error("Method not implemented.")
    }
    delete(id: string): Promise<ICategory> {
        throw new Error("Method not implemented.")
    }
    getAll(): Promise<Array<ICategory>> {
        throw new Error("Method not implemented.")
    }
    async getBy(type: "id" | "slug", id: string): Promise<ICategory> {
        let data: ICategory | null
        switch (type) {
            case "id":
                data = await Category.findById(id)
                break
            case "slug":
                data = await Category.findOne({ slug: id })
                break
            default:
                throw new ObjectModelNotFoundException()
        }
        if (!data) throw new ObjectModelNotFoundException()
        return data
    }
}
