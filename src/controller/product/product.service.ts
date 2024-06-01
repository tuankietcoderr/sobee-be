import { IProduct, IVariant } from "@/interface"
import { CreateProductRequest } from "./dto"
import { ProductRepository } from "./product.repository"
import { CategoryService } from "../category"
import { Product, SCHEMA_NAME } from "@/models"
import { EProductType } from "@/enum"
import { ObjectModelNotFoundException, ObjectModelOperationException } from "@/common/exceptions"
import { BrandService } from "../brand"
import { generateNameId, getIdFromNameId } from "@/common/utils"
import { DeleteResult } from "mongodb"

export class ProductService implements ProductRepository {
  private readonly categoryService: CategoryService
  private readonly brandService: BrandService

  private readonly generalPopulate = {
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

  constructor() {
    this.categoryService = new CategoryService()
    this.brandService = new BrandService()
  }

  async create(req: CreateProductRequest): Promise<IProduct> {
    const { category, variants, type, brand } = req
    const _variants = (variants as IVariant[]) || []
    await this.categoryService.getOne("_id", category.toString())
    brand && (await this.brandService.getOne("_id", brand.toString()))
    const minPrice = Math.min(..._variants.map((v) => v.price))
    const maxPrice = Math.max(..._variants.map((v) => v.price))
    const product = new Product({
      ...req,
      minPrice,
      maxPrice,
      variants: [],
      brand: brand || null
    })

    const slug = generateNameId({
      name: product.name,
      id: product._id?.toString() as string
    })

    product.slug = slug

    if (type === EProductType.VARIABLE) {
      if (!variants || variants.length === 0) {
        throw new ObjectModelOperationException("Variable product must have at least one attribute")
      }

      product.variants = _variants
      product.isVariation = true
    }

    await product.save()

    return product
  }

  async update(id: string, data: Partial<IProduct>): Promise<IProduct> {
    const { variants, type } = data
    const product = await Product.findById(id)

    if (!product) throw new ObjectModelNotFoundException("Product not found")

    data.brand = data.brand || undefined

    if (!product.isVariation && product.variants.length > 0) {
      data.variants = []
    } else {
      if (variants) {
        const _variants = variants as IVariant[]
        const minPrice = Math.min(..._variants.map((v) => v.price))
        const maxPrice = Math.max(..._variants.map((v) => v.price))
        data.minPrice = minPrice
        data.maxPrice = maxPrice
      }
    }

    await product.updateOne(data)

    return product
  }

  async delete(id: string): Promise<DeleteResult> {
    const product = await Product.findById(id)

    if (!product) throw new ObjectModelNotFoundException("Product not found")

    return await product.deleteOne()
  }

  async getPublishedProducts(query: any): Promise<IProduct[]> {
    const priceRange = query.priceRange || null
    const keyword = query.keyword || null
    const categories = query.categories && query.categories !== "All" ? [query.categories].flat() : null
    const colors = query.colors && query.colors !== "All" ? [query.colors].flat().map((v) => `#${v}`) : null
    const sizes = query.sizes && query.sizes !== "All" ? query.sizes : null
    const ratings = query.ratings && query.ratings !== "All" ? query.ratings : null
    const sortBy = (query.sortBy && query.sortBy) || "Newest"
    const isOnSale = query.isOnSale

    const sorts = [
      {
        label: "Price: Low to High",
        key: "displayPrice-asc"
      },
      {
        label: "Price: High to Low",
        key: "displayPrice-desc"
      },
      {
        label: "Rating: Low to High",
        key: "ratingValue-asc"
      },
      {
        label: "Rating: High to Low",
        key: "ratingValue-desc"
      },
      {
        label: "Newest",
        key: "createdAt-desc"
      },
      {
        label: "Oldest",
        key: "createdAt-asc"
      },
      {
        label: "Best Selling",
        key: "sold-desc"
      },
      {
        label: "Most Popular",
        key: "ratingCount-desc"
      }
    ]

    const sort = sorts.find((s) => s.key === sortBy)
    const [sortKey, dir] = sort?.key.split("-") ?? ["createdAt", "desc"]

    return await Product.find(
      {
        $and: [
          { isDraft: false },
          JSON.stringify(query) !== "{}"
            ? {
                $and: [
                  priceRange
                    ? {
                        $or: [
                          { displayPrice: { $gte: priceRange[0], $lte: priceRange[1] } },
                          {
                            maxPrice: { $gte: priceRange[0], $lte: priceRange[1] }
                          }
                        ]
                      }
                    : {},
                  keyword ? { name: { $regex: keyword, $options: "i" } } : {},
                  categories ? { category: { $in: categories } } : {},
                  colors
                    ? {
                        "variants.color": { $in: colors }
                      }
                    : {},
                  sizes ? { "variants.size": { $in: sizes } } : {},
                  ratings ? { ratingValue: { $in: ratings } } : {},
                  isOnSale !== "false" ? { isDiscount: true } : {}
                ]
              }
            : {}
        ]
      },
      {},
      {
        ...this.generalPopulate,
        sort: {
          [sortKey]: dir === "asc" ? 1 : -1
        }
      }
    )
  }

  async getDraftProducts(): Promise<IProduct[]> {
    return await Product.find(
      { isDraft: true },
      {
        category: 1,
        name: 1,
        displayPrice: 1,
        type: 1,
        quantity: 1,
        status: 1,
        updatedAt: 1
      },
      {
        populate: {
          path: "category",
          select: "name"
        }
      }
    ).sort({ createdAt: -1 })
  }

  async getOne(type: keyof IProduct, id: string): Promise<IProduct> {
    const product = await Product.findOne(
      { [type]: id },
      {},
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
            select: "name logo website"
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
    if (!product) throw new ObjectModelNotFoundException("Product not found")
    return product
  }

  async getFeatured(): Promise<IProduct[]> {
    return await Product.find({ isFeatured: true }, {}, this.generalPopulate)
  }

  async getRelated(productId: string): Promise<IProduct[]> {
    const processedSlug = getIdFromNameId(productId)
    const product = await Product.findById(processedSlug)
    if (!product) throw new ObjectModelNotFoundException("Product not found")

    return await Product.find({ category: product.category }, {}, this.generalPopulate)
      .sort({ createdAt: -1 })
      .limit(10)
  }

  async getRecommended(): Promise<IProduct[]> {
    return await Product.find(
      {
        ratingCount: { $gt: 3 },
        ratingValue: { $gt: 3 },
        sold: { $gt: 0 }
      },
      {},
      this.generalPopulate
    )
      .sort({ ratingValue: -1, ratingCount: -1 })
      .limit(10)
  }

  async getBestSeller(): Promise<IProduct[]> {
    return await Product.find(
      {
        sold: { $gt: 0 }
      },
      {},
      this.generalPopulate
    )
      .sort({ sold: -1 })
      .limit(10)
  }

  async getPopular(): Promise<IProduct[]> {
    return await Product.find({ ratingCount: { $gt: 3 }, ratingValue: { $gt: 3 } }, {}, this.generalPopulate)
      .sort({ ratingValue: -1, ratingCount: -1 })
      .limit(10)
  }

  async getDiscounted(): Promise<IProduct[]> {
    return await Product.find({ isDiscount: true }, {}, this.generalPopulate)
  }

  async getColors(): Promise<string[]> {
    const colors = await Product.aggregate([
      { $unwind: "$variants" },
      { $group: { _id: "$variants.color" } },
      { $project: { _id: 0, color: "$_id" } },
      { $sort: { color: 1 } }
    ])

    return colors.map((c) => c.color)
  }

  async getBySlug(slug: string): Promise<IProduct> {
    const processedSlug = getIdFromNameId(slug)
    const product = await Product.findById(processedSlug, {}, this.generalPopulate)
    if (!product) throw new ObjectModelNotFoundException("Product not found")
    return product
  }

  async getUserFavorites(userId: string): Promise<IProduct[]> {
    return await Product.find(
      {
        favoritesBy: {
          $elemMatch: {
            $eq: userId
          }
        }
      },
      {},
      this.generalPopulate
    )
  }

  async toggleFavorite(productId: string, userId: string): Promise<IProduct> {
    const product = await Product.findById(productId)
    if (!product) throw new ObjectModelNotFoundException("Product not found")

    const index = product.favoritesBy.findIndex((id) => id === userId)

    if (index === -1) {
      product.favoritesBy.push(userId)
    } else {
      product.favoritesBy.splice(index, 1)
    }

    await product.save()

    return product
  }
}
