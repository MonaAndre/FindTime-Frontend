import api from '@/plugins/axios'
import type { ServiceResponse } from '@/types/api'
import type {
  CreateEventDtoRequest,
  CreateEventDtoResponse,
  DeleteEventDtoRequest,
  DeleteEventDtoResponse,
  GetAllEventsNextWeekDtoResponse,
  GetAllGroupEventsResponse,
  NextEventDtoResponse,
  UpdateEventDtoRequest,
  UpdateEventDtoResponse,
} from '@/types/events'

export const eventApi = {
  async createEvent(req: CreateEventDtoRequest): Promise<ServiceResponse<CreateEventDtoResponse>> {
    const response = await api.post<ServiceResponse<CreateEventDtoResponse>>(
      'api/Event/create-event',
      req,
    )
    return response.data
  },
  async updateEvent(req: UpdateEventDtoRequest): Promise<ServiceResponse<UpdateEventDtoResponse>> {
    const response = await api.post<ServiceResponse<UpdateEventDtoResponse>>(
      'api/Event/update-event',
      req,
    )
    return response.data
  },
  async deleteEvent(req: DeleteEventDtoRequest): Promise<ServiceResponse<DeleteEventDtoResponse>> {
    const response = await api.post<ServiceResponse<DeleteEventDtoResponse>>(
      'api/Event/delete-event',
      req,
    )
    return response.data
  },
  async getGroupEvents(
    groupId: number,
    rangeStart: Date,
    rangeEnd: Date,
  ): Promise<ServiceResponse<GetAllGroupEventsResponse[]>> {
    const response = await api.get<ServiceResponse<GetAllGroupEventsResponse[]>>(
      `api/Event/get-group-events/${groupId}`,
      {
        params: {
          rangeStart: rangeStart.toISOString(),
          rangeEnd: rangeEnd.toISOString(),
        },
      },
    )
    return response.data
  },
  async getNextEvent(groupId: number): Promise<ServiceResponse<NextEventDtoResponse>> {
    const response = await api.post<ServiceResponse<NextEventDtoResponse>>(
      `api/Event/get-next-event/${groupId}`,
    )
    return response.data
  },
  async getEventsForNextWeek(): Promise<ServiceResponse<GetAllEventsNextWeekDtoResponse[]>> {
    const response = await api.get<ServiceResponse<GetAllEventsNextWeekDtoResponse[]>>(
      `/api/Event/get-all-events-next-week`,
    )
    return response.data
  },
}
