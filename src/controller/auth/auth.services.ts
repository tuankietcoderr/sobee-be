import { Credential, User } from "@/models"
import { AuthRepository } from "./auth.repository"
import { LoginRequest, LoginResponse, MeRequest, MeResponse, RegisterRequest, RegisterResponse } from "./dto"
import { UserAlreadyExistsException, UserNotFoundException, WrongPasswordException } from "@/common/exceptions"
import { comparePassword, generateToken, hashPassword } from "@/common/utils"

export class AuthService implements AuthRepository {
    async register(data: RegisterRequest): Promise<RegisterResponse> {
        const { email, username, password } = data

        const user = await User.findOne({ $or: [{ username }, { email }] })

        if (user) {
            throw new UserAlreadyExistsException()
        }

        const newUser = new User(data)

        const hashedPassword = await hashPassword(password!)

        const newCredential = new Credential({
            userId: newUser._id,
            password: hashedPassword
        })

        const accessToken = generateToken({ userId: newUser._id.toHexString() })

        await newUser.save()
        await newCredential.save()

        return {
            accessToken,
            user: newUser
        }
    }
    async login(data: LoginRequest): Promise<LoginResponse> {
        const { usernameOrEmail, password } = data

        const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] })

        if (!user) {
            throw new UserNotFoundException()
        }

        const credential = await Credential.findOne({ userId: user._id })

        if (!credential) {
            throw new UserNotFoundException()
        }

        const isPasswordMatch = await comparePassword(password, credential.password)

        if (!isPasswordMatch) {
            throw new WrongPasswordException()
        }

        const accessToken = generateToken({ userId: user._id.toHexString() })

        return {
            accessToken,
            user
        }
    }
    async me(data: MeRequest): Promise<MeResponse> {
        const { userId } = data

        const user = await User.findById(userId)

        if (!user) {
            throw new UserNotFoundException()
        }

        return { user }
    }
}
