import { Admin, Credential, Customer, Staff, User } from "@/models"
import { AuthRepository } from "./auth.repository"
import { LoginRequest, LoginResponse, MeRequest, MeResponse, RegisterRequest, RegisterResponse } from "./dto"
import {
    InvalidRoleException,
    UserAlreadyExistsException,
    UserNotFoundException,
    WrongPasswordException
} from "@/common/exceptions"
import { comparePassword, generateToken, hashPassword } from "@/common/utils"
import { ERole } from "@/enum"

export class AuthService implements AuthRepository {
    async register(data: RegisterRequest): Promise<RegisterResponse> {
        const { email, phoneNumber, password, role } = data

        const user = await User.findOne({ $or: [{ phoneNumber }, { email }] })

        if (user) {
            throw new UserAlreadyExistsException()
        }

        const newUser = new User(data)

        const hashedPassword = await hashPassword(password!)

        const newCredential = new Credential({
            userId: newUser._id,
            password: hashedPassword
        })

        let objectUser
        switch (role) {
            case ERole.ADMIN:
                objectUser = new Admin()
                break
            case ERole.CUSTOMER:
                objectUser = new Customer()
                break
            case ERole.STAFF:
                objectUser = new Staff()
                break
            default:
                throw new InvalidRoleException()
        }

        newUser.user = objectUser._id

        const accessToken = generateToken({ userId: newUser._id.toHexString(), role })

        await objectUser.save()
        await newUser.save()
        await newCredential.save()

        return {
            accessToken,
            user: newUser
        }
    }
    async login(data: LoginRequest): Promise<LoginResponse> {
        const { emailOrPhone, password } = data

        const user = await User.findOne({ $or: [{ phoneNumber: emailOrPhone }, { email: emailOrPhone }] })

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

        const accessToken = generateToken({ userId: user._id.toHexString(), role: user.role })

        return {
            accessToken,
            user
        }
    }
    async me(data: MeRequest): Promise<MeResponse> {
        const { userId } = data

        const user = await User.findById(
            userId,
            {},
            {
                populate: {
                    path: "user"
                }
            }
        )

        if (!user) {
            throw new UserNotFoundException()
        }

        return { user }
    }
}
