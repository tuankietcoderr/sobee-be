import "module-alias/register"
import { configDotenv } from "dotenv"
import express from "express"
import { config, run } from "./common/utils/config"
import { connectDB } from "./common/utils/db"
import getRoutes from "./routes"

configDotenv()
connectDB()

const app = config(express)
getRoutes(app)
run(app)
