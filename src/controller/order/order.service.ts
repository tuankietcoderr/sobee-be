import { Order } from "@/models"
import { OrderRepository } from "./order.repository"

export class OrderService implements OrderRepository {
    async createOrder(): Promise<void> {
        throw new Error("Method not implemented.")
    }
    async getOrders(): Promise<void> {
        return await Order.find().populate("orderItems").populate("customer").populate("shippingAddress").lean()
    }
    async getOrderById(): Promise<void> {
        throw new Error("Method not implemented.")
    }
    async updateOrder(): Promise<void> {
        throw new Error("Method not implemented.")
    }
    async deleteOrder(): Promise<void> {
        throw new Error("Method not implemented.")
    }

    async createOrderItem(): Promise<void> {
        throw new Error("Method not implemented.")
    }
    async getOrderItems(): Promise<void> {
        throw new Error("Method not implemented.")
    }
    async getOrderItemById(): Promise<void> {
        throw new Error("Method not implemented.")
    }
    async updateOrderItem(): Promise<void> {
        throw new Error("Method not implemented.")
    }
    async deleteOrderItem(): Promise<void> {
        throw new Error("Method not implemented.")
    }
}
