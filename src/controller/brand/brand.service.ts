import { IBrand, IProduct, TotalAndData } from "@/interface"
import { BrandRepository } from "./brand.repository"
import { Brand, Product, SCHEMA_NAME } from "@/models"
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

  async findAll(page: number, limit: number): Promise<IBrand[]> {
    const skip = (page - 1) * limit
    const brandWithProductCount = await Brand.aggregate([
      {
        $lookup: {
          from: SCHEMA_NAME.PRODUCTS,
          localField: "_id",
          foreignField: "brand",
          as: "products"
        }
      },
      {
        $project: {
          name: 1,
          slug: 1,
          logo: 1,
          products: 1
        }
      },
      {
        $addFields: {
          productCount: {
            $size: "$products"
          }
        }
      },
      { $limit: limit + skip },
      { $skip: skip },
      {
        $project: {
          products: 0
        }
      }
    ])
    return brandWithProductCount.sort((a, b) => b.productCount - a.productCount)
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

  async getProducts(id: string, page: number, limit: number): Promise<TotalAndData<IProduct>> {
    const brand = await Brand.findById(id)
    if (!brand) throw new ObjectModelNotFoundException("Brand not found")

    const brandQuery = () =>
      Product.find(
        { brand: brand._id },
        { description: 0 },
        {
          populate: [
            {
              path: "category",
              select: "name"
            },
            {
              path: "variants"
            },
            {
              path: "brand",
              select: "name logo"
            },
            {
              path: "tax",
              select: "name rate"
            },
            {
              path: "shippingFee"
            }
          ]
        }
      )

    const total = await brandQuery().countDocuments()
    const data = await brandQuery()
      .limit(limit)
      .skip((page - 1) * limit)
    return {
      total,
      data
    }
  }

  async getBrandAndProducts(
    page: number,
    limit: number
  ): Promise<
    TotalAndData<
      IBrand & {
        products: IProduct[]
      }
    >
  > {
    const productAndCategory = () =>
      Brand.aggregate([
        {
          $lookup: {
            from: SCHEMA_NAME.PRODUCTS,
            localField: "_id",
            foreignField: "brand",
            as: "products",
            pipeline: [
              {
                $limit: 10
              },
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
            slug: 1,
            products: 1
          }
        },
        {
          $sort: {
            name: 1
          }
        }
      ])

    const total = await Brand.countDocuments().exec()
    const data = await productAndCategory()
      .limit(limit + (page - 1) * limit)
      .skip((page - 1) * limit)

    return {
      total,
      data
    }
  }
}
