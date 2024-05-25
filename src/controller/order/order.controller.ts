import { IOrder, IRoute } from "@/interface"
import { OrderService } from "./order.service"
import { Request, Response, Router } from "express"
import { HttpStatusCode, SuccessfulResponse, asyncHandler } from "@/common/utils"
import middleware from "@/common/middleware"

export class OrderController implements IRoute {
  private readonly router: Router
  private readonly path: string

  private readonly PATHS = {
    ORDER_ITEM: "/item",
    ORDER_ITEM_ID: "/item/:id",
    ORDER_ITEM_QUANTITY: "/item/:id/quantity",
    ORDER: "/"
  }

  private static readonly orderService = new OrderService()

  constructor(path = "/api/order") {
    this.router = Router()
    this.path = path
    this.router.use(middleware.verifyToken)
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.post(this.PATHS.ORDER_ITEM, middleware.mustHaveFields("product"), asyncHandler(this.addOrderItem))
    this.router.delete(this.PATHS.ORDER_ITEM_ID, asyncHandler(this.removeOrderItem))
    this.router.put(
      this.PATHS.ORDER_ITEM_QUANTITY,
      middleware.mustHaveFields("quantity"),
      asyncHandler(this.updateOrderItemQuantity)
    )
    this.router.post(this.PATHS.ORDER, middleware.mustHaveFields<IOrder>("orderItems"), asyncHandler(this.createOrder))
  }

  private async addOrderItem(req: Request, res: Response): Promise<void> {
    const orderItem = await OrderController.orderService.addOrderItem({
      ...req.body,
      customer: req.userId
    })
    new SuccessfulResponse(orderItem, HttpStatusCode.CREATED, "Order item added successfully").from(res)
  }

  private async removeOrderItem(req: Request, res: Response): Promise<void> {
    await OrderController.orderService.removeOrderItem(req.params.id)
    new SuccessfulResponse(null, HttpStatusCode.NO_CONTENT, "Order item removed successfully").from(res)
  }

  private async updateOrderItemQuantity(req: Request, res: Response): Promise<void> {
    const orderItem = await OrderController.orderService.updateOrderItemQuantity(req.params.id, req.body.quantity)
    new SuccessfulResponse(orderItem, HttpStatusCode.OK, "Order item quantity updated successfully").from(res)
  }

  private async createOrder(req: Request, res: Response): Promise<void> {
    const order = await OrderController.orderService.createOrder({
      ...req.body,
      customer: req.userId
    })
    new SuccessfulResponse(order, HttpStatusCode.CREATED, "Order created successfully").from(res)
  }

  getPath(): string {
    return this.path
  }

  getRouter(): Router {
    return this.router
  }
}
