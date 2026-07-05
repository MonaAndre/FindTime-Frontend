export enum NotificationType {
  EventCreated = 0,
  EventUpdated = 1,
  NoteAdded = 2,
  Reminder = 3,
  EventInvitation = 4,
  EventDeleted = 5,
  RsvpResponse = 6,
}

export interface NotificationDtoResponse {
  notificationId: number
  type: NotificationType
  message: string
  eventId: number | null
  groupId: number | null
  isRead: boolean
  createdAt: string
  readAt: string | null
}

export interface MarkNotificationAsReadDtoRequest {
  notificationId: number
}
