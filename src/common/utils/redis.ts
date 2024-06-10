import { createClient } from "redis"

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST
  }
})

redisClient.once("connect", () => {
  console.log("Redis connected")
})

redisClient.on("error", (error) => {
  console.log(error)
})

export { redisClient }
