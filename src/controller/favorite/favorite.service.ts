import { IFavorite } from "@/interface"
import { FavoriteRepository } from "./favorite.repository"
import { Favorite, Product } from "@/models"
import { ObjectModelNotFoundException } from "@/common/exceptions"
import { convertToObjectIdMongodb } from "@/common/utils"
import { ProductService } from "../product"

export class FavoriteService implements FavoriteRepository {
  private readonly productService: ProductService

  constructor() {
    this.productService = new ProductService()
  }
  async toogleFavoriteProduct(customerId: string, productId: string): Promise<IFavorite> {
    //check if favorite exists
    let favorite = await Favorite.findOne({ customer: customerId })
    if (!favorite) {
      favorite = await Favorite.create({ customer: customerId, products: [] })
    }

    //check if product is already in the favorite list
    const index = favorite.products.findIndex((id: any) => id.toString() === productId)
    if (index !== -1) {
      //remove product from the favorite list
      favorite.products.splice(index, 1)
      await this.productService.toggleFavorite(productId, customerId)
    } else {
      //add product to the favorite list
      favorite.products.push(productId as any)
      await this.productService.toggleFavorite(productId, customerId)
    }
    const productDetails = await Promise.all(
      favorite.products.map(async (productId: any) => await this.productService.getOne("_id", productId))
    )

    const newFavorite = await favorite.save()

    return { ...newFavorite.toObject(), products: productDetails }
  }
  async getFavorites(customerId: string): Promise<IFavorite> {
    const favorite = await Favorite.findOne({ customer: customerId }).lean()
    if (!favorite) {
      return await Favorite.create({ customer: customerId, products: [] })
    }
    //if favorite not found, create a new favorite with empty product list
    const productDetails = await Promise.all(
      favorite.products.map(async (productId: any) => await this.productService.getOne("_id", productId))
    )
    const newFavorite = { ...favorite, products: productDetails }

    return newFavorite
  }
  async removeAllFavoriteProducts(customerId: string): Promise<IFavorite> {
    //check if favorite exists
    const favorite = await Favorite.findOne({ customer: customerId })
    if (!favorite) {
      return await Favorite.create({ customer: customerId, products: [] })
    }
    Promise.all(
      favorite.products.map(async (productId: any) => await this.productService.toggleFavorite(productId, customerId))
    )

    //remove all products from the favorite list
    favorite.products = []
    await favorite.save()

    return favorite
  }
}
