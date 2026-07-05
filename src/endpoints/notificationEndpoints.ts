import api from '@/plugins/axios'
import type { ServiceResponse } from '@/types/api'
import type { MarkNotificationAsReadDtoRequest, NotificationDtoResponse } from '@/types/notification'

export const notificationApi = {
  async getNotifications(
    unreadOnly?: boolean,
    page?: number,
    pageSize?: number,
  ): Promise<ServiceResponse<NotificationDtoResponse[]>> {
    const response = await api.get<ServiceResponse<NotificationDtoResponse[]>>(
      'api/Notification/get-notifications',
      { params: { unreadOnly, page, pageSize } },
    )
    return response.data
  },
  async getUnreadCount(): Promise<ServiceResponse<number>> {
    const response = await api.get<ServiceResponse<number>>('api/Notification/get-unread-count')
    return response.data
  },
  async markAsRead(req: MarkNotificationAsReadDtoRequest): Promise<ServiceResponse<boolean>> {
    const response = await api.post<ServiceResponse<boolean>>(
      'api/Notification/mark-as-read',
      req,
    )
    return response.data
  },
  async markAllAsRead(): Promise<ServiceResponse<boolean>> {
    const response = await api.post<ServiceResponse<boolean>>('api/Notification/mark-all-as-read')
    return response.data
  },
}
