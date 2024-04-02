import { asyncHandler, errorHandlerMiddleware } from "@/common/utils"
import {
    AddressController,
    AssetController,
    AttributeController,
    AuthController,
    CategoryController,
    ChatMessageController,
    ChatRoomController,
    CouponController,
    CustomerController,
    FavoriteController,
    NotificationController,
    OrderController,
    OrderItemController,
    PaymentMethodController,
    PermissionController,
    ProductAssetAttributeController,
    ProductController,
    ReviewController,
    RoleController,
    StaffController,
    UserController
} from "@/controller"
import { Express } from "express"

function getRoutes(app: Express) {
    const controllers = [
        new AddressController(),
        new AssetController(),
        new AttributeController(),
        new AuthController(),
        new CategoryController(),
        new ChatMessageController(),
        new ChatRoomController(),
        new CouponController(),
        new CustomerController(),
        new FavoriteController(),
        new NotificationController(),
        new OrderController(),
        new OrderItemController(),
        new PaymentMethodController(),
        new PermissionController(),
        new ProductController(),
        new ProductAssetAttributeController(),
        new ReviewController(),
        new RoleController(),
        new StaffController(),
        new UserController()
    ]

    controllers.forEach((controller) => {
        app.use(controller.getPath(), asyncHandler(controller.getRouter()))
    })
    app.use(errorHandlerMiddleware)
}

export default getRoutes
