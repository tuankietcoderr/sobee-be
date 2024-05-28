import { IBrand, IProduct } from "@/interface"
import { BrandRepository } from "./brand.repository"
import { Brand, SCHEMA_NAME } from "@/models"
import { ObjectModelNotFoundException } from "@/common/exceptions"
import { stringToObjectId } from "@/common/utils"

export class BrandService implements BrandRepository {
  async create(req: IBrand): Promise<IBrand> {
    return await Brand.create(req)
  }

  async update(id: string, req: Partial<IBrand>): Promise<IBrand> {
    const brand = await Brand.findByIdAndUpdate(id, { $set: req }, { new: true })
    if (!brand) throw new ObjectModelNotFoundException("Brand not found")
    return brand
  }

  async delete(id: string): Promise<IBrand> {
    const brand = await Brand.findByIdAndDelete(id)
    if (!brand) throw new ObjectModelNotFoundException("Brand not found")
    return brand
  }

  async findAll(): Promise<IBrand[]> {
    return await Brand.find().lean()
  }

  async findById(id: string): Promise<IBrand> {
    const brand = await Brand.findById(id).lean()
    if (!brand) throw new ObjectModelNotFoundException("Brand not found")
    return brand
  }

  async getOne(type: string, value: string): Promise<IBrand> {
    const brand = await Brand.findOne({ [type]: value }).lean()
    if (!brand) throw new ObjectModelNotFoundException("Brand not found")
    return brand
  }

  async getProducts(id: string): Promise<
    (IBrand & {
      products: IProduct[]
    })[]
  > {
    const data = await Brand.aggregate([
      {
        $match: {
          _id: stringToObjectId(id)
        }
      },
      {
        $lookup: {
          from: SCHEMA_NAME.PRODUCTS,
          localField: "_id",
          foreignField: "brand",
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

  async getBrandAndProducts(): Promise<any[]> {
    const productAndBrand = await Brand.aggregate([
      {
        $lookup: {
          from: SCHEMA_NAME.PRODUCTS,
          localField: "_id",
          foreignField: "brand",
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
    return productAndBrand
  }
}
