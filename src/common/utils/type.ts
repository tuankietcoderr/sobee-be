const { Types } = require("mongoose")

export const convertToObjectIdMongodb = (id: string) => {
    return new Types.ObjectId(id)
}
