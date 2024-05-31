import { ICustomer, IUser } from "@/interface"
import { CustomerRepository } from "./customer.repository"
import { Credential, Customer, User } from "@/models"
import { ObjectModelNotFoundException, UserAlreadyExistsException } from "@/common/exceptions"
import { hashPassword } from "@/common/utils"
import { ERole } from "@/enum"

export class CustomerService implements CustomerRepository {
  async create(req: IUser): Promise<IUser> {
    const { email, phoneNumber, password } = req

    const user = await User.findOne({ $or: [{ phoneNumber }, { email }] })

    if (user) {
      throw new UserAlreadyExistsException()
    }

    req.role = ERole.CUSTOMER
    req.avatar = req.avatar || `https://avatar.iran.liara.run/username?username=${encodeURIComponent(req.name)}`

    const newUser = new User(req)

    const hashedPassword = await hashPassword(password!)

    const newCredential = new Credential({
      userId: newUser._id,
      password: hashedPassword
    })
    const objectUser = new Customer(req._user as ICustomer)
    newUser._user = objectUser._id

    await newCredential.save()
    await objectUser.save()

    const savedUser = await newUser.save()
    savedUser._user = objectUser

    return savedUser as IUser
  }

  async getAll(): Promise<IUser[]> {
    return await User.find({ role: ERole.CUSTOMER }).populate("_user").lean()
  }

  async getById(id: string): Promise<IUser> {
    const user = await User.findById(id).populate("_user").lean()

    if (!user) {
      throw new ObjectModelNotFoundException()
    }

    return user as IUser
  }

  async banCustomer(id: string): Promise<IUser> {
    const user = await User.findById(id).populate("_user").lean()
    if (!user) {
      throw new ObjectModelNotFoundException()
    }

    const customer = await Customer.findByIdAndUpdate(
      (user._user as ICustomer)._id,
      {
        $set: {
          isActive: false
        }
      },
      { new: true }
    ).lean()
    if (!customer) {
      throw new ObjectModelNotFoundException()
    }
    user._user = customer

    return user as IUser
  }

  async unbanCustomer(id: string): Promise<IUser> {
    const user = await User.findById(id).populate("_user").lean()
    if (!user) {
      throw new ObjectModelNotFoundException()
    }

    const customer = await Customer.findByIdAndUpdate(
      (user._user as ICustomer)._id,
      {
        $set: {
          isActive: true
        }
      },
      { new: true }
    ).lean()
    if (!customer) {
      throw new ObjectModelNotFoundException()
    }
    user._user = customer

    return user as IUser
  }

  async update(id: string, data: Partial<IUser>): Promise<IUser> {
    const customerUpdate = data._user as Partial<ICustomer>
    const customer = await Customer.findByIdAndUpdate(
      customerUpdate._id,
      { $set: customerUpdate },
      { new: true }
    ).lean()
    if (!customer) {
      throw new ObjectModelNotFoundException("Customer not found")
    }

    delete data._user
    const user = await User.findByIdAndUpdate(id, { $set: data }, { new: true }).populate("_user").lean()

    if (!user) {
      throw new ObjectModelNotFoundException("User not found")
    }

    return user as IUser
  }

  async delete(id: string): Promise<any> {
    const user = await User.findById(id)
    if (!user) {
      throw new ObjectModelNotFoundException()
    }

    await Customer.findByIdAndDelete(user._user)

    return user.deleteOne()
  }
}
