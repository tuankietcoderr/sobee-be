import { AuthController } from "@/controller"
import { Express } from "express"

function getRoutes(app: Express) {
    const authController = new AuthController()

    app.use(authController.getPath(), authController.getRouter())
}

export default getRoutes
