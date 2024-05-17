import { asyncHandler, errorHandlerMiddleware } from "@/common/utils"
import {
    AddressController,
    AttributeController,
    AuthController,
    BrandController,
    CardController,
    CategoryController,
    ChatMessageController,
    ChatRoomController,
    CouponController,
    CustomerController,
    DayOffController,
    FaqController,
    FavoriteController,
    NotificationController,
    OrderController,
    OrderItemController,
    PaymentAccountController,
    PaymentMethodController,
    PermissionController,
    ProductAssetAttributeController,
    ProductController,
    ReviewController,
    RoleController,
    ShippingController,
    StaffController,
    TaxController,
    TermController,
    UploadController,
    UserController
} from "@/controller"
import { Express } from "express"

function getRoutes(app: Express) {
    const controllers = [
        new AddressController(),
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
        new UserController(),
        new TaxController(),
        new DayOffController(),
        new BrandController(),
        new ShippingController(),
        new FaqController(),
        new TermController(),
        new UploadController(),
        new CardController(),
        new PaymentAccountController()
    ]

    controllers.forEach((controller) => {
        app.use(controller.getPath(), asyncHandler(controller.getRouter()))
    })
    app.use(errorHandlerMiddleware)
}

export default getRoutes
