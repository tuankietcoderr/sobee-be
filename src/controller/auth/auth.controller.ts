import { UserAlreadyExistsException, UserNotFoundException, WrongPasswordException } from "@/common/exceptions"
import middleware from "@/common/middleware"
import { ErrorResponse, SuccessfulResponse } from "@/common/utils"
import { IRoute } from "@/interface"
import { Request, Response, Router } from "express"
import { AuthService } from "./auth.service"
import { LoginRequest, RegisterRequest } from "./dto"
import { HttpStatusCode } from "@/common/utils"
import { RefreshTokenRequest } from "./dto/refreshToken.dto"

export class AuthController implements IRoute {
    private router: Router
    private path: string
    private readonly PATHS = {
        REGISTER: "/register",
        LOGIN: "/login",
        REFRESH_TOKEN: "/refresh-token",
        LOG_OUT: "/logout",
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
            middleware.mustHaveFields<RegisterRequest>("email", "name", "password"),
            this.register
        )

        this.router.post(
            this.PATHS.LOGIN,
            middleware.mustHaveFields<LoginRequest>("emailOrPhone", "password"),
            this.login
        )
        this.router.get(this.PATHS.ME, middleware.verifyToken, this.me)
        this.router.post(
            this.PATHS.REFRESH_TOKEN,
            middleware.mustHaveFields<RefreshTokenRequest>("refreshToken"),
            middleware.verifyToken,
            this.handleRefreshToken
        )
        this.router.post(this.PATHS.LOG_OUT, middleware.verifyToken, this.logout)
    }

    private async register(req: Request, res: Response) {
        try {
            const response = await AuthController.authService.register(req.body)
            new SuccessfulResponse(response, HttpStatusCode.CREATED, "Register successfully").from(res)
        } catch (error: any) {
            if (error instanceof UserAlreadyExistsException) {
                new ErrorResponse(error.statusCode, error.message).from(res)
            } else {
                new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message).from(res)
            }
        }
    }

    private async login(req: Request, res: Response) {
        try {
            const response = await AuthController.authService.login(req.body)
            new SuccessfulResponse(response, HttpStatusCode.OK, "Login successfully").from(res)
        } catch (error: any) {
            if (error instanceof UserNotFoundException || error instanceof WrongPasswordException) {
                new ErrorResponse(error.statusCode, error.message).from(res)
            } else {
                new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message).from(res)
            }
        }
    }

    private async me(req: Request, res: Response) {
        try {
            const response = await AuthController.authService.me({ userId: req.userId })
            new SuccessfulResponse(response, HttpStatusCode.OK, "Get me successfully").from(res)
        } catch (error: any) {
            if (error instanceof UserNotFoundException) {
                new ErrorResponse(error.statusCode, error.message).from(res)
            }
            new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message).from(res)
        }
    }

    private async handleRefreshToken(req: Request, res: Response) {
        try {
            const response = await AuthController.authService.handleRefreshToken(
                { userId: req.userId, role: req.role },
                req.body.refreshToken,
                req.keyToken
            )
            new SuccessfulResponse(response, HttpStatusCode.OK, "Refresh token successfully").from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message).from(res)
        }
    }

    private async logout(req: Request, res: Response) {
        try {
            const response = await AuthController.authService.logout(req.userId)
            new SuccessfulResponse(response, HttpStatusCode.OK, "Logout successfully").from(res)
        } catch (error: any) {
            new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message).from(res)
        }
    }

    getPath(): string {
        return this.path
    }

    getRouter(): Router {
        return this.router
    }
}
