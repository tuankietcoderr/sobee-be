import { IProductAssetAttribute } from "@/interface"
import { ProductAssetAttributeRepository } from "./product-asset-attribute.repository"
import { ProductAssetAttribute } from "@/models"
import { ObjectModelNotFoundException } from "@/common/exceptions"
import { AttributeService } from "../attribute"
import { ProductService } from "../product"
import { CreateProductAssetAttributeRequest, CreateProductAssetAttributeResponse } from "./dto"

export class ProductAssetAttributeService implements ProductAssetAttributeRepository {
    private static readonly attributeService = new AttributeService()
    private static readonly productService = new ProductService()

    async create(req: CreateProductAssetAttributeRequest): Promise<CreateProductAssetAttributeResponse> {
        const { attribute, assets, product } = req
        await ProductAssetAttributeService.attributeService.getById(attribute.toString())
        await ProductAssetAttributeService.productService.getBy("id", product.toString())
        const productAssetAttribute = await ProductAssetAttribute.create(req)
        return productAssetAttribute
    }
    async update(id: string, data: Partial<IProductAssetAttribute>): Promise<IProductAssetAttribute> {
        const updated = await ProductAssetAttribute.findByIdAndUpdate(id, { $set: data })
        if (!updated) throw new ObjectModelNotFoundException()
        return updated
    }
    async delete(id: string): Promise<IProductAssetAttribute> {
        const deleted = await ProductAssetAttribute.findByIdAndDelete(id)
        if (!deleted) throw new ObjectModelNotFoundException()
        return deleted
    }
    async getAll(): Promise<IProductAssetAttribute[]> {
        const productAssetAttributes = await ProductAssetAttribute.find()
        return productAssetAttributes
    }

    async getByProduct(id: string): Promise<IProductAssetAttribute[]> {
        const productAssetAttributes = await ProductAssetAttribute.find({ product: id })
        return productAssetAttributes
    }

    async getById(id: string): Promise<IProductAssetAttribute> {
        const productAssetAttribute = await ProductAssetAttribute.findById(id)
        if (!productAssetAttribute) throw new ObjectModelNotFoundException()
        return productAssetAttribute
    }
}
