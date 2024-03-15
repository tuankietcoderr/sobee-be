import { Types } from "mongoose"

import { IFavorite } from "@/interface"
import { FavoriteRepository } from "./favorite.repository"
import { Favorite, Product } from "@/models"
import { ObjectModelNotFoundException } from "@/common/exceptions"
import { convertToObjectIdMongodb } from "@/common/utils"

export class FavoriteService implements FavoriteRepository {
    async favoriteProduct(customerId: string, productId: string): Promise<IFavorite> {
        //check if product exists
        const product = await Product.findOne({ _id: productId })
        if (!product) throw new ObjectModelNotFoundException("Product not found")

        const favorite = await Favorite.findOne({ customer: customerId })

        //if favorite not found, create a new favorite and increment the product favorite count by 1
        if (!favorite) {
            await product.updateOne({ favoritesCount: product.favoritesCount + 1 })
            return await Favorite.create({ customer: customerId, products: [productId] })
        }

        //if favorite found and the product is not in the favorite list, add the product to the favorite list and increment the product favorite count by 1
        if (!favorite.products.toString().includes(productId)) {
            product.favoritesCount += 1
            await product.save()

            favorite.products.push(convertToObjectIdMongodb(productId))
            await favorite.save()
        }

        return favorite
    }
    async unfavoriteProduct(customerId: string, productId: string): Promise<IFavorite> {
        //check if favorite exists
        const favorite = await Favorite.findOne({ customer: customerId })
        if (!favorite) throw new ObjectModelNotFoundException("Favorite not found")

        const product = await Product.findOne({ _id: productId })
        //check if product exists and if it is in the favorite list
        if (product && favorite.products.toString().includes(productId)) {
            product.favoritesCount -= 1
            await product.save()
        }

        //remove the product from the favorite list
        favorite.products = favorite.products.filter((id) => id.toString() !== productId) as Types.ObjectId[]
        await favorite.save()

        return favorite
    }
    async getFavorites(customerId: string): Promise<IFavorite> {
        const favorite = await Favorite.findOne({ customer: customerId }).populate("products")
        if (favorite) return favorite
        //if favorite not found, create a new favorite with empty product list
        const newFavorite = await Favorite.create({ customer: customerId, products: [] })
        return newFavorite
    }
    async removeAllFavoriteProducts(customerId: string): Promise<IFavorite> {
        //check if favorite exists
        const favorite = await Favorite.findOne({ customer: customerId })
        if (!favorite) throw new ObjectModelNotFoundException("Favorite not found")

        Promise.all(
            favorite.products.map(async (productId) => {
                const product = await Product.findOne({ _id: productId })
                if (product) {
                    product.favoritesCount -= 1
                    await product.save()
                }
            })
        )

        //remove all products from the favorite list
        favorite.products = []
        await favorite.save()

        return favorite
    }
}
