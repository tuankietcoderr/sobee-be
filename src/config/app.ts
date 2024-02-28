import express from "express"
import cors from "cors"
import morgan from "morgan"
import getRoutes from "@/routes"

const app = express()
const allowOrigins = process.env.ALLOWED_ORIGIN?.trim()?.split(",") ?? "*"
app.use(
    cors({
        origin: allowOrigins,
        exposedHeaders: "content-length",
        credentials: true,
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Origin",
            "X-Requested-With",
            "Accept",
            "Accept-Encoding",
            "Accept-Language",
            "Host",
            "Referer",
            "User-Agent",
            "X-CSRF-Token"
        ],
        maxAge: 86400,
        preflightContinue: false,
        optionsSuccessStatus: 204
    })
)

app.use(morgan("common"))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

app.use(express.json({ limit: "50mb" }))

// getRoutes(app)

export default app
