import { configDotenv } from "dotenv"
import { Client } from "minio"
configDotenv()

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || "test"
const FIELD_NAME = "file"

class MinioStorage {
    private static _instance: MinioStorage
    private minioClient: Client

    public static get Instance() {
        return this._instance || (this._instance = new this())
    }

    private constructor() {
        this.minioClient = new Client({
            endPoint: process.env.MINIO_ENDPOINT,
            port: Number(process.env.MINIO_PORT),
            useSSL: process.env.MINIO_USE_SSL === "true",
            accessKey: process.env.MINIO_ACCESS_KEY,
            secretKey: process.env.MINIO_SECRET_KEY
        })
    }

    private async bucketExists(bucketName: string) {
        try {
            return await this.minioClient.bucketExists(bucketName)
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async createBucket(bucketName: string, region: string = "southeast-1") {
        try {
            const exists = await this.bucketExists(bucketName)
            if (exists) {
                return
            }
            await this.minioClient.makeBucket(bucketName, region)
        } catch (error) {
            throw new Error("Error creating bucket.")
        }
    }

    public async getBuckets() {
        try {
            return await this.minioClient.listBuckets()
        } catch (error) {
            console.log(error)
            throw new Error("Error getting buckets.")
        }
    }

    public async uploadFile(bucketName: string, file: Express.Multer.File, uniqueName: string) {
        try {
            await this.createBucket(bucketName)
            await this.minioClient.putObject(bucketName, uniqueName, file.buffer)
        } catch (error) {
            throw new Error("Error uploading file.")
        }
    }

    public async getFile(bucketName: string, fileName: string) {
        try {
            return await this.minioClient.getObject(bucketName, fileName)
        } catch (error) {
            throw new Error("Error getting file.")
        }
    }

    public async removeFile(bucketName: string, fileName: string) {
        try {
            await this.minioClient.removeObject(bucketName, fileName)
        } catch (error) {
            throw new Error("Error removing file.")
        }
    }

    public async removeFiles(bucketName: string, fileNames: string[]) {
        try {
            await this.minioClient.removeObjects(bucketName, fileNames)
        } catch (error) {
            throw new Error("Error removing files.")
        }
    }
}

export { MinioStorage, BUCKET_NAME, FIELD_NAME }
