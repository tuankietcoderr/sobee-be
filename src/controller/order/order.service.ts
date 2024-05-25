import { Coupon, Order, OrderItem, Product } from "@/models"
import { OrderRepository } from "./order.repository"
import { IOrder, IOrderItem } from "@/interface"
import { ObjectModelNotFoundException, ObjectModelOperationException } from "@/common/exceptions"
import { DeleteResult } from "mongodb"
import { CouponService } from "../coupon"
import { ECouponType, EOrderStatus } from "@/enum"
import { generateOrderId } from "@/common/utils"

export class OrderService implements OrderRepository {
  private readonly couponService: CouponService

  constructor() {
    this.couponService = new CouponService()
  }

  async addOrderItem(data: IOrderItem): Promise<IOrderItem> {
    const product = await Product.findById(data.product)
    if (!product) {
      throw new ObjectModelNotFoundException("Product not found")
    }

    let price = 0
    let subTotal = 0

    if (product.isVariation) {
      const { color, size, amount } = data

      const productVariantIndex = product.variants.findIndex((v) => v.color === color && v.size === size)

      if (productVariantIndex === -1) {
        throw new ObjectModelNotFoundException("Product variant not found")
      }

      const productVariant = product.variants[productVariantIndex]

      if (productVariant.amount < amount) {
        throw new ObjectModelOperationException("Product variant not enough")
      }

      productVariant.amount -= amount

      product.variants[productVariantIndex] = productVariant

      price = productVariant.price

      subTotal = productVariant.price * amount
    } else {
      subTotal = product.displayPrice * data.amount
      product.quantity -= data.amount
      price = product.displayPrice
    }

    if (product.isDiscount) {
      subTotal -= subTotal * product.discount
    }

    const orderItem = new OrderItem({
      ...data,
      price,
      subTotal
    })

    await orderItem.save()
    await product.save()

    return orderItem
  }

  async removeOrderItem(id: string): Promise<DeleteResult> {
    const orderItem = await OrderItem.findById(id)
    if (!orderItem) {
      throw new ObjectModelNotFoundException("Order item not found")
    }

    const product = await Product.findById(orderItem.product)
    if (!product) {
      throw new ObjectModelNotFoundException("Product not found")
    }

    if (product.isVariation) {
      const { color, size, amount } = orderItem

      const productVariant = product.variants.find((v) => v.color === color && v.size === size)

      if (!productVariant) {
        throw new ObjectModelNotFoundException("Product variant not found")
      }

      productVariant.amount += amount
    }

    const deleted = await orderItem.deleteOne()

    await product.save()

    return deleted
  }

  async updateOrderItemQuantity(id: string, quantity: number): Promise<IOrderItem> {
    const orderItem = await OrderItem.findById(id)
    if (!orderItem) {
      throw new ObjectModelNotFoundException("Order item not found")
    }

    const product = await Product.findById(orderItem.product)

    if (!product) {
      throw new ObjectModelNotFoundException("Product not found")
    }

    let subTotal = 0

    if (product.isVariation) {
      const { color, size, amount } = orderItem

      const productVariant = product.variants.find((v) => v.color === color && v.size === size)

      if (!productVariant) {
        throw new ObjectModelNotFoundException("Product variant not found")
      }

      if (productVariant.amount < quantity) {
        throw new ObjectModelOperationException("Product variant not enough")
      }

      productVariant.amount -= amount
      productVariant.amount += quantity
      orderItem.amount = quantity

      subTotal = productVariant.price * quantity
    } else {
      subTotal = product.displayPrice * quantity
    }

    if (product.isDiscount) {
      subTotal -= (subTotal * product.discount) / 100
    }

    orderItem.subTotal = subTotal

    await orderItem.save()

    await product.save()

    return orderItem
  }

  async createOrder(data: IOrder): Promise<IOrder> {
    const orderItems = data.orderItems as IOrderItem[]

    let total = orderItems.reduce((acc, item) => {
      return acc + item.subTotal
    }, 0)

    if (data.coupon) {
      const coupon = await this.couponService.use(data.coupon.toString(), data.customer.toString())
      if (coupon.type === ECouponType.FIXED) {
        total -= coupon.discountValue
      } else {
        total -= total * (coupon.discountValue / 100)
      }
    }

    const order = new Order({ ...data, total })

    order.orderGeneratedId = generateOrderId()

    order.status = EOrderStatus.PENDING

    await order.save()

    return order
  }

  async getOrderItemsByCustomer(customerId: string): Promise<IOrderItem[]> {
    const orderItems = await OrderItem.find(
      { customer: customerId },
      {},
      {
        populate: [
          {
            path: "product",
            select: "name thumbnail"
          }
        ]
      }
    )
    return orderItems
  }

  // async getOrdersByCustomer(customerId: string): Promise<IOrder[]> {}
}
