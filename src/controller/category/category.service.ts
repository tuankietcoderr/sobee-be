import { ICategory, IProduct } from "@/interface"
import { CategoryRepository } from "./category.repository"
import { CreateCategoryRequest, CreateCategoryResponse } from "./dto"
import { Category, Product, SCHEMA_NAME } from "@/models"
import { ObjectModelNotFoundException, ObjectModelOperationException } from "@/common/exceptions"
import { stringToObjectId } from "@/common/utils"

export class CategoryService implements CategoryRepository {
  async create(req: CreateCategoryRequest): Promise<CreateCategoryResponse> {
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
  async getOne(type: keyof ICategory, id: string): Promise<ICategory> {
    const data = await Category.findOne({ [type]: id })
    if (!data) throw new ObjectModelNotFoundException()
    return data
  }

  async getProducts(id: string): Promise<
    (ICategory & {
      products: IProduct[]
    })[]
  > {
    const data = await Category.aggregate([
      {
        $match: {
          _id: stringToObjectId(id)
        }
      },
      {
        $lookup: {
          from: SCHEMA_NAME.PRODUCTS,
          localField: "_id",
          foreignField: "category",
          as: "products",
          pipeline: [
            {
              $lookup: {
                from: SCHEMA_NAME.BRAND,
                localField: "brand",
                foreignField: "_id",
                as: "brand",
                pipeline: [
                  {
                    $project: {
                      products: 0
                    }
                  }
                ]
              }
            },
            { $unwind: "$brand" },
            {
              $project: {
                description: 0
              }
            },
            {
              $lookup: {
                from: SCHEMA_NAME.CATEGORIES,
                localField: "category",
                foreignField: "_id",
                as: "category",
                pipeline: [
                  {
                    $project: {
                      description: 0
                    }
                  }
                ]
              }
            },
            { $unwind: "$category" }
          ]
        }
      }
    ])
    return data.length > 0 ? data[0] : null
  }

  async getCategoryAndProducts(): Promise<any[]> {
    const productAndCategory = await Category.aggregate([
      {
        $lookup: {
          from: SCHEMA_NAME.PRODUCTS,
          localField: "_id",
          foreignField: "category",
          as: "products",
          pipeline: [
            {
              $lookup: {
                from: SCHEMA_NAME.BRAND,
                localField: "brand",
                foreignField: "_id",
                as: "brand",
                pipeline: [
                  {
                    $project: {
                      products: 0
                    }
                  }
                ]
              }
            },
            { $unwind: "$brand" },
            {
              $project: {
                description: 0
              }
            },
            {
              $lookup: {
                from: SCHEMA_NAME.CATEGORIES,
                localField: "category",
                foreignField: "_id",
                as: "category",
                pipeline: [
                  {
                    $project: {
                      description: 0
                    }
                  }
                ]
              }
            },
            { $unwind: "$category" }
          ]
        }
      },
      {
        $project: {
          name: 1,
          products: 1
        }
      },
      {
        $sort: {
          name: 1
        }
      }
    ])
    return productAndCategory
  }
}
