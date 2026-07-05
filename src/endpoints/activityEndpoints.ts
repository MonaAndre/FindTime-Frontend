import api from '@/plugins/axios'
import type { ServiceResponse } from '@/types/api'
import type { ActivityDtoResponse } from '@/types/activity'

export const activityApi = {
  async getUserActivity(
    page?: number,
    pageSize?: number,
  ): Promise<ServiceResponse<ActivityDtoResponse[]>> {
    const response = await api.get<ServiceResponse<ActivityDtoResponse[]>>(
      'api/Activity/get-user-activity',
      { params: { page, pageSize } },
    )
    return response.data
  },
  async getGroupActivity(
    groupId: number,
    page?: number,
    pageSize?: number,
  ): Promise<ServiceResponse<ActivityDtoResponse[]>> {
    const response = await api.get<ServiceResponse<ActivityDtoResponse[]>>(
      `api/Activity/get-group-activity/${groupId}`,
      { params: { page, pageSize } },
    )
    return response.data
  },
}
