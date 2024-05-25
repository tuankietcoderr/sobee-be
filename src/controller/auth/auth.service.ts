import { Admin, Credential, Customer, Staff, User } from "@/models"
import { AuthRepository } from "./auth.repository"
import {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  MeRequest,
  MeResponse,
  RegisterRequest,
  RegisterResponse
} from "./dto"
import {
  InvalidRoleException,
  UserAlreadyExistsException,
  UserNotFoundException,
  WrongPasswordException
} from "@/common/exceptions"
import { comparePassword, createKeyPair, createTokenPair, hashPassword } from "@/common/utils"
import { ERole } from "@/enum"
import KeyTokenService from "@/common/utils/keyToken"
import { IKeyToken } from "@/interface/schema"
import KeyToken from "@/models/KeyToken"
import { RefreshTokenResponse } from "./dto/refreshToken.dto"

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
      default:
        throw new InvalidRoleException()
    }

    newUser._user = objectUser._id

    const { privateKey, publicKey } = await createKeyPair()
    const { accessToken, refreshToken } = await createTokenPair({ userId: newUser._id, role }, publicKey, privateKey)

    // store the key pair and refresh token to database
    await KeyTokenService.createKeyToken({
      userId: newUser._id,
      publicKey,
      privateKey,
      refreshToken
    })

    // save the user, credential and objectUser to database
    await objectUser.save()
    await newUser.save()
    await newCredential.save()

    return {
      accessToken,
      refreshToken,
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

    const { privateKey, publicKey } = await createKeyPair()
    const { accessToken, refreshToken } = await createTokenPair(
      { userId: user._id, role: user.role },
      publicKey,
      privateKey
    )

    await KeyTokenService.createKeyToken({
      userId: user._id,
      publicKey,
      privateKey,
      refreshToken
    })

    return {
      accessToken,
      refreshToken,
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
          path: "_user"
        }
      }
    )

    if (!user) {
      throw new UserNotFoundException()
    }

    return { user }
  }

  async handleRefreshToken(
    user: { userId: string; role: string },
    refreshToken: string,
    keyStore: IKeyToken
  ): Promise<RefreshTokenResponse> {
    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      //doing something here because the token is already used before
      KeyTokenService.deleteByUserId(keyStore.user)
      throw new Error("Token already used")
    }

    if (refreshToken !== keyStore.refreshToken) {
      throw new Error("Invalid token")
    }

    const foundUser = await User.findById(user.userId)
    if (!foundUser) {
      throw new Error("User not found")
    }

    const { accessToken, refreshToken: newRefreshToken } = await createTokenPair(
      { userId: user.userId, role: user.role },
      keyStore.publicKey,
      keyStore.privateKey
    )

    await KeyToken.updateOne(
      { refreshToken: refreshToken },
      {
        $set: {
          refreshToken: newRefreshToken
        },
        $push: {
          refreshTokenUsed: refreshToken
        }
      }
    )

    return { accessToken, refreshToken: newRefreshToken }
  }

  async logout(userId: string): Promise<object> {
    return await KeyTokenService.deleteByUserId(userId)
  }

  async changePassword(data: ChangePasswordRequest): Promise<null> {
    const { userId, oldPassword, newPassword } = data

    const user = await User.findById(userId)

    if (!user) {
      throw new UserNotFoundException()
    }

    const credential = await Credential.findOne({ userId })

    if (!credential) {
      throw new UserNotFoundException()
    }

    const isPasswordMatch = await comparePassword(oldPassword, credential.password)

    if (!isPasswordMatch) {
      throw new WrongPasswordException()
    }

    const hashedPassword = await hashPassword(newPassword)

    await Credential.updateOne({ userId }, { password: hashedPassword })

    return null
  }
}
