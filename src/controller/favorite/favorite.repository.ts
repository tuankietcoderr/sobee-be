import { IFavorite } from "@/interface"

export abstract class FavoriteRepository {
    abstract favoriteProduct(customerId: string, productId: string): Promise<IFavorite>
    abstract unfavoriteProduct(customerId: string, productId: string): Promise<IFavorite>
    abstract getFavorites(customerId: string): Promise<IFavorite>
}
