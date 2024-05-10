import { IDayOff } from "@/interface"
import { DeleteResult } from "mongodb"
import { DayOffRepository } from "./day-off.repository"
import { DayOff } from "@/models"
import { ObjectModelNotFoundException } from "@/common/exceptions"

export class DayOffService implements DayOffRepository {
    async create(req: IDayOff): Promise<IDayOff> {
        return await DayOff.create(req)
    }
    async getAll(): Promise<IDayOff[]> {
        return await DayOff.find(
            {},
            {},
            {
                populate: {
                    path: "staff",
                    select: "name avatar"
                }
            }
        )
    }
    async getOne<T = string>(key: keyof IDayOff, value: T): Promise<IDayOff> {
        const dayOff = await DayOff.findOne({ [key]: value })
        if (!dayOff) {
            throw new ObjectModelNotFoundException()
        }
        return dayOff
    }
    async update(id: string, req: IDayOff): Promise<IDayOff> {
        const dayOff = await DayOff.findByIdAndUpdate(id, { $set: req }, { new: true })
        if (!dayOff) {
            throw new ObjectModelNotFoundException()
        }
        return dayOff
    }
    async delete(id: string): Promise<DeleteResult> {
        const result = await DayOff.findById(id)
        if (!result) {
            throw new ObjectModelNotFoundException()
        }
        return await result.deleteOne()
    }
}
