import { Socket } from "socket.io"
import { PushNotificationRequest } from "./dto"
import { NotificationRepository } from "./notification.repository"
import { ENotificationType } from "@/enum"
import { Notification } from "@/models"

export class NotificationService implements NotificationRepository {
  async push(notification: PushNotificationRequest): Promise<void> {
    const { type } = notification
    console.log("Pushing notification", notification)
    switch (type) {
      case ENotificationType.SYSTEM:
        this.pushSystemNotification(notification)
        break
      default:
        break
    }
    await Notification.create(notification)
  }

  private pushSystemNotification(notification: PushNotificationRequest) {
    console.log("System notification", notification)
  }
}
