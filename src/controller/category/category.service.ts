import { ICategory } from "@/interface"
import { CategoryRepository } from "./category.repository"
import { CreateCategoryRequest, CreateCategoryResponse } from "./dto"
import { Asset, Category, Product } from "@/models"
import { ObjectModelNotFoundException, ObjectModelOperationException } from "@/common/exceptions"
import { AssetService } from "../asset"

export class CategoryService implements CategoryRepository {
    private readonly assetService = new AssetService()

    async create(req: CreateCategoryRequest): Promise<CreateCategoryResponse> {
        const { image } = req

        const asset = await Asset.findById(image)

        if (!asset) throw new ObjectModelNotFoundException("Asset not found")

        return await Category.create(req)
    }
    async update(id: string, data: Partial<ICategory>): Promise<ICategory> {
        const category = await Category.findByIdAndUpdate(
            id,
            {
                $set: data
            },
            { new: true }
        )
        if (!category) throw new ObjectModelOperationException("Category not found")
        return category
    }
    async delete(id: string): Promise<ICategory> {
        const category = await Category.findByIdAndDelete(id)
        if (!category) throw new ObjectModelOperationException("Category not found")
        return category
    }
    async getAll(): Promise<Array<ICategory>> {
        return await Category.find()
    }
    async getBy(type: "id" | "slug", id: string): Promise<ICategory> {
        const data = await Category.findOne({ [type]: id })
        if (!data) throw new ObjectModelNotFoundException()
        return data
    }

    async getProducts(id: string): Promise<ICategory[]> {
        return await Product.find({ category: id })
    }
}
