import { env } from "node:process"
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGODB_URI: string
            PORT: number
            JWT_SECRET: string
            ALLOWED_ORIGIN: string
            JWT_EXPIRES_IN: string
            MINIO_ENDPOINT: string
            MINIO_PORT: string
            MINIO_ACCESS_KEY: string
            MINIO_SECRET_KEY: string
            MINIO_USE_SSL: string
        }
    }
}
