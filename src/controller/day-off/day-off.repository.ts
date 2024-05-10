import { CreateDayOffRequestDto, CreateDayOffResponseDto } from "./dto"
import { DeleteResult } from "mongodb"

export abstract class DayOffRepository {
    abstract create(req: CreateDayOffRequestDto): Promise<CreateDayOffResponseDto>
    abstract getAll(): Promise<CreateDayOffResponseDto[]>
    abstract getOne<T = string>(key: keyof CreateDayOffResponseDto, value: T): Promise<CreateDayOffResponseDto>
    abstract update(id: string, req: CreateDayOffRequestDto): Promise<CreateDayOffResponseDto>
    abstract delete(id: string): Promise<DeleteResult>
}
