import { INotification } from "@/interface"

export type PushNotificationRequest = Omit<INotification, "read" | "to">
