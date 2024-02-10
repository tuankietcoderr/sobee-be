import { env } from "node:process"
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGODB_URI: string
            PORT: number
            JWT_SECRET: string
            ALLOWED_ORIGIN: string
            JWT_EXPIRES_IN: string
        }
    }
}
