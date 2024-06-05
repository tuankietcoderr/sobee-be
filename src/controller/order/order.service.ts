import { Cart, Coupon, Order, OrderItem, Product } from "@/models"
import { OrderRepository } from "./order.repository"
import { IOrder, IOrderItem, TotalAndData } from "@/interface"
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

    if (product.isVariation) {
      const existOrderItem = await OrderItem.findOne({
        customer: data.customer,
        product: data.product,
        size: data.size,
        color: data.color
      })

      if (existOrderItem) {
        return await this.updateOrderItemQuantity(existOrderItem._id.toString(), existOrderItem.amount + data.amount)
      }
    } else {
      const existOrderItem = await OrderItem.findOne({ customer: data.customer, product: data.product })

      if (existOrderItem) {
        return await this.updateOrderItemQuantity(existOrderItem._id.toString(), existOrderItem.amount + data.amount)
      }
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
      price = product.displayPrice
    }

    product.quantity -= data.amount

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

    return await orderItem.populate({
      path: "product",
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
    })
  }

  async removeOrderItem(id: string): Promise<DeleteResult> {
    const orderItem = await OrderItem.findById(id)
    if (!orderItem) {
      throw new ObjectModelNotFoundException("Order item not found")
    }

    const orderItemInOrders = await Order.findOne({
      "orderItems._id": id
    })

    if (orderItemInOrders) {
      return await orderItem.deleteOne()
    }

    const product = await Product.findById(orderItem.product)
    if (!product) {
      throw new ObjectModelNotFoundException("Product not found")
    }

    if (product.isVariation) {
      const { color, size, amount } = orderItem

      const productVariantIndex = product.variants.findIndex((v) => v.color === color && v.size === size)

      if (productVariantIndex === -1) {
        throw new ObjectModelNotFoundException("Product variant not found")
      }

      const productVariant = product.variants[productVariantIndex]

      productVariant.amount += amount

      product.variants[productVariantIndex] = productVariant
    }

    product.quantity += orderItem.amount

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

      const productVariantIndex = product.variants.findIndex((v) => v.color === color && v.size === size)

      if (productVariantIndex === -1) {
        throw new ObjectModelNotFoundException("Product variant not found")
      }

      const productVariant = product.variants[productVariantIndex]

      if (productVariant.amount < quantity) {
        throw new ObjectModelOperationException("Product variant not enough")
      }

      productVariant.amount -= amount
      productVariant.amount += quantity
      orderItem.amount = quantity

      product.variants[productVariantIndex] = productVariant

      subTotal = orderItem.price * quantity
    } else {
      subTotal = product.displayPrice * quantity
      orderItem.amount = quantity
    }

    product.quantity += orderItem.amount - quantity

    if (product.isDiscount) {
      subTotal -= (subTotal * product.discount) / 100
    }

    orderItem.subTotal = subTotal

    await orderItem.save()

    await product.save()

    return await orderItem.populate({
      path: "product",
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
    })
  }

  async createOrder(data: IOrder): Promise<IOrder> {
    const cart = await Cart.findOne({ customer: data.customer })

    if (!cart) {
      throw new ObjectModelNotFoundException("Cart not found")
    }

    if (data.coupon) {
      const coupon = await this.couponService.use(data.coupon.toString(), data.customer.toString())
      data.coupon = coupon._id!
    }

    const orderItems = await OrderItem.find({ customer: data.customer, _id: { $in: data.orderItems } }).lean()

    const order = new Order({
      ...data,
      orderItems
    })

    order.orderGeneratedId = generateOrderId()

    order.status = EOrderStatus.PENDING

    cart.cartItems = []

    await order.save()
    await cart.save()

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
            select: "name thumbnail isVariation slug shippingFee tax isDiscount discount",
            populate: [
              {
                path: "shippingFee"
              },
              {
                path: "tax",
                select: "name rate"
              }
            ]
          }
        ]
      }
    )
    return orderItems
  }

  async getOrdersByCustomer(customerId: string): Promise<IOrder[]> {
    const orders = await Order.find(
      {
        customer: customerId
      },
      {},
      {}
    )
    return orders
  }

  async getOrderById(id: string): Promise<IOrder> {
    const order = await Order.findById(id).populate({
      path: "orderItems",
      populate: [
        {
          path: "product",
          select: "name thumbnail isVariation slug shippingFee tax isDiscount discount",
          populate: [
            {
              path: "shippingFee"
            },
            {
              path: "tax",
              select: "name rate"
            }
          ]
        }
      ]
    })

    if (!order) {
      throw new ObjectModelNotFoundException("Order not found")
    }

    return order
  }

  async getAllOrders(page: number, limit: number, keyword: string = ""): Promise<TotalAndData<IOrder>> {
    const orders = () =>
      Order.find({
        $or: [
          {
            orderGeneratedId: { $regex: keyword, $options: "i" }
          },
          {
            phoneNumber: { $regex: keyword, $options: "i" }
          },
          {
            emailAdress: { $regex: keyword, $options: "i" }
          }
        ]
      }).populate({
        path: "customer",
        select: "name avatar"
      })

    const total = await orders().countDocuments().exec()
    const data = await orders()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec()

    return {
      total,
      data
    }
  }
}
