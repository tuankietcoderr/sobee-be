import { PushNotificationRequest } from "./dto"

export abstract class NotificationRepository {
    abstract push(notification: PushNotificationRequest): Promise<void>
}
