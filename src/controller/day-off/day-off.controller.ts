import { IRoute } from "@/interface"
import { DayOffService } from "./day-off.service"
import { Request, Response, Router } from "express"
import middleware from "@/common/middleware"
import { HttpStatusCode, SuccessfulResponse, asyncHandler } from "@/common/utils"
import { ERole } from "@/enum"

export class DayOffController implements IRoute {
  private readonly router: Router
  private readonly path: string

  private readonly PATHS = {
    ROOT: "/",
    DAY_OFF: "/:dayOffId"
  }

  private static readonly dayOffService = new DayOffService()

  constructor(path = "/api/day-off") {
    this.router = Router()
    this.router.use(middleware.verifyToken)
    this.router.use(middleware.verifyRoles(ERole.ADMIN))
    this.path = path
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.post(this.PATHS.ROOT, asyncHandler(this.createDayOff))
    this.router.get(this.PATHS.ROOT, asyncHandler(this.getAllDayOff))
    this.router.get(this.PATHS.DAY_OFF, asyncHandler(this.getOneDayOff))
    this.router.put(this.PATHS.DAY_OFF, asyncHandler(this.updateDayOff))
    this.router.delete(this.PATHS.DAY_OFF, asyncHandler(this.deleteDayOff))
  }

  private async createDayOff(req: Request, res: Response): Promise<void> {
    let staffId: string = ""
    if (!req.body.staff && req.role === ERole.STAFF) {
      staffId = req.userId
    } else if (req.role === ERole.ADMIN) {
      staffId = req.body.staff
    }
    const result = await DayOffController.dayOffService.create({ ...req.body, staff: staffId })
    new SuccessfulResponse(result, HttpStatusCode.CREATED, "Create day off successfully").from(res)
  }

  private async getAllDayOff(req: Request, res: Response): Promise<void> {
    const result = await DayOffController.dayOffService.getAll()
    new SuccessfulResponse(result, HttpStatusCode.OK, "Get all day off successfully").from(res)
  }

  private async getOneDayOff(req: Request, res: Response): Promise<void> {
    const result = await DayOffController.dayOffService.getOne("_id", req.params.id)
    new SuccessfulResponse(result, HttpStatusCode.OK, "Get one day off successfully").from(res)
  }

  private async updateDayOff(req: Request, res: Response): Promise<void> {
    const result = await DayOffController.dayOffService.update(req.params.dayOffId, req.body)
    new SuccessfulResponse(result, HttpStatusCode.OK, "Update day off successfully").from(res)
  }

  private async deleteDayOff(req: Request, res: Response): Promise<void> {
    const result = await DayOffController.dayOffService.delete(req.params.dayOffId)
    new SuccessfulResponse(result, HttpStatusCode.OK, "Delete day off successfully").from(res)
  }

  getPath(): string {
    return this.path
  }

  getRouter(): Router {
    return this.router
  }
}
