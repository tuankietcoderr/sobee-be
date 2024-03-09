import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import crypto from "crypto"

export const generateToken = (payload: string | object | Buffer) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

export const verifyToken = (token: string, secretKey: string) => {
    return jwt.verify(token, secretKey)
}

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash)
}

export const createTokenPair = async (
    payload: string | object | Buffer,
    publicKey: string,
    privateKey: string
): Promise<{ accessToken: string; refreshToken: string }> => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, publicKey, { expiresIn: "2 days" }, (err, accessToken) => {
            if (accessToken == undefined || err) {
                reject(err)
                throw new Error("Failed to create access token")
            }
            jwt.sign(payload, privateKey, { expiresIn: "7 days" }, (err, refreshToken) => {
                if (refreshToken == undefined || err) {
                    reject(err)
                    throw new Error("Failed to create refresh token")
                }
                resolve({ accessToken, refreshToken })
            })
        })
    })
    // const accessToken = jwt.sign(payload, publicKey, {
    //     expiresIn: "2 days"
    // })
    // const refreshToken = jwt.sign(payload, privateKey, {
    //     expiresIn: "7 days"
    // })

    // return { accessToken, refreshToken }
}

export const createKeyPair = () => {
    const publicKey = crypto.randomBytes(64).toString("hex")
    const privateKey = crypto.randomBytes(64).toString("hex")

    return { publicKey, privateKey }
}
