import { IProduct, IVariant } from "@/interface"
import { CreateProductRequest } from "./dto"
import { ProductRepository } from "./product.repository"
import { CategoryService } from "../category"
import { Product } from "@/models"
import { EProductType } from "@/enum"
import { ObjectModelNotFoundException, ObjectModelOperationException } from "@/common/exceptions"
import { VariantService } from "../variant"
import { BrandService } from "../brand"
import { generateNameId } from "@/common/utils"
import { DeleteResult } from "mongodb"

export class ProductService implements ProductRepository {
    private readonly categoryService: CategoryService
    private readonly variantService: VariantService
    private readonly brandService: BrandService

    constructor() {
        this.categoryService = new CategoryService()
        this.variantService = new VariantService()
        this.brandService = new BrandService()
    }

    async create(req: CreateProductRequest): Promise<IProduct> {
        const { category, variants, type, brand } = req
        const _variants = variants as IVariant[]
        await this.categoryService.getOne("_id", category.toString())
        await this.brandService.getOne("_id", brand.toString())
        const minPrice = Math.min(..._variants.map((v) => v.price))
        const maxPrice = Math.max(..._variants.map((v) => v.price))

        const product = new Product({
            ...req,
            minPrice,
            maxPrice,
            variants: []
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

            const _ids = [] as string[]
            for (const variant of _variants) {
                const res = await this.variantService.create(variant)
                _ids.push(res._id?.toString() as string)
            }
            product.variants = _ids
        }

        await product.save()

        return product
    }

    async update(id: string, data: Partial<IProduct>): Promise<IProduct> {
        const { variants, type } = data
        const product = await Product.findById(id)

        if (!product) throw new ObjectModelNotFoundException("Product not found")

        if (type === EProductType.SIMPLE && product.variants.length > 0) {
            data.variants = []
            const variantsPromises = (product.variants as string[]).map(
                async (v) => await this.variantService.delete(v)
            )
            await Promise.all(variantsPromises)
        }

        if (variants) {
            const _variants = variants as IVariant[]
            const minPrice = Math.min(..._variants.map((v) => v.price))
            const maxPrice = Math.max(..._variants.map((v) => v.price))
            data.minPrice = minPrice
            data.maxPrice = maxPrice
            const ids = [] as string[]
            const updateVariantsPromises = _variants.map(async (v) => {
                if (v._id) {
                    ids.push(v._id.toString())
                    return await this.variantService.update(v._id.toString(), v)
                } else {
                    const newV = await this.variantService.create(v)
                    ids.push(newV._id?.toString() as string)
                }
            })
            await Promise.all(updateVariantsPromises)
            data.variants = ids
        }

        await product.updateOne(data)

        return product
    }

    async delete(id: string): Promise<DeleteResult> {
        const product = await Product.findById(id)

        if (!product) throw new ObjectModelNotFoundException("Product not found")

        if (product.variants.length > 0) {
            const variantsPromises = (product.variants as string[]).map(
                async (v) => await this.variantService.delete(v)
            )
            await Promise.all(variantsPromises)
        }

        return await product.deleteOne()
    }

    async getPublishedProducts(): Promise<IProduct[]> {
        return await Product.find(
            { isDraft: false },
            {},
            {
                populate: {
                    path: "category",
                    select: "name"
                }
            }
        ).sort({ createdAt: -1 })
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
                    }
                ]
            }
        )
        if (!product) throw new ObjectModelNotFoundException("Product not found")
        return product
    }

    async getFeatured(): Promise<IProduct[]> {
        return await Product.find({ isFeatured: true })
    }

    async getRelated(category: string): Promise<IProduct[]> {
        return await Product.find({ category })
    }

    async getBestSeller(): Promise<IProduct[]> {
        return await Product.find({
            sold: { $gt: 0 }
        })
            .sort({ sold: -1 })
            .limit(10)
    }

    async getPopular(): Promise<IProduct[]> {
        return await Product.find({ ratingCount: { $gt: 3 }, ratingValue: { $gt: 3 } })
            .sort({ ratingValue: -1, ratingCount: -1 })
            .limit(10)
    }

    async getDiscounted(): Promise<IProduct[]> {
        return await Product.find({ isDiscount: true })
    }
}
