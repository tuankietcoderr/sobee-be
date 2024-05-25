import "jsonwebtoken"

declare module "jsonwebtoken" {
  export interface JwtPayload {
    userId: string
    role: string
  }
}
