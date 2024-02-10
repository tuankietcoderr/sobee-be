import { UserAlreadyExistsException, UserNotFoundException, WrongPasswordException } from "@/common/exceptions"
import middleware from "@/common/middleware"
import { ErrorResponse, SuccessfulResponse } from "@/common/utils"
import { IRoute } from "@/interface"
import { Request, Response, Router } from "express"
import { AuthService } from "./auth.services"
import { LoginRequest, RegisterRequest } from "./dto"

export class AuthController implements IRoute {
    private router: Router
    private path: string
    private readonly PATHS = {
        REGISTER: "/register",
        LOGIN: "/login",
        ME: "/me"
    }

    private static readonly authService = new AuthService()

    constructor(path = "/api/auth") {
        this.router = Router()
        this.path = path
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(
            this.PATHS.REGISTER,
            middleware.mustHaveFields<RegisterRequest>("email", "name", "password", "role", "username"),
            this.register
        )

        this.router.post(
            this.PATHS.LOGIN,
            middleware.mustHaveFields<LoginRequest>("usernameOrEmail", "password"),
            this.login
        )

        this.router.get(this.PATHS.ME, middleware.verifyToken, this.me)
    }

    private async register(req: Request, res: Response) {
        try {
            const response = await AuthController.authService.register(req.body)
            new SuccessfulResponse(response, 201, "Register successfully").from(res)
        } catch (error: any) {
            if (error instanceof UserAlreadyExistsException) {
                new ErrorResponse(error.statusCode, error.message).from(res)
            } else {
                new ErrorResponse(500, error.message).from(res)
            }
        }
    }

    private async login(req: Request, res: Response) {
        try {
            const response = await AuthController.authService.login(req.body)
            new SuccessfulResponse(response, 200, "Login successfully").from(res)
        } catch (error: any) {
            if (error instanceof UserNotFoundException || error instanceof WrongPasswordException) {
                new ErrorResponse(error.statusCode, error.message).from(res)
            } else {
                new ErrorResponse(500, error.message).from(res)
            }
        }
    }

    private async me(req: Request, res: Response) {
        try {
            const response = await AuthController.authService.me(req.body)
            new SuccessfulResponse(response, 200, "Get me successfully").from(res)
        } catch (error: any) {
            if (error instanceof UserNotFoundException) {
                new ErrorResponse(error.statusCode, error.message).from(res)
            }
            new ErrorResponse(500, error.message).from(res)
        }
    }

    getPath(): string {
        return this.path
    }

    getRouter(): Router {
        return this.router
    }
}
