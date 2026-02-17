export enum RecurrencePattern {
  Daily = 0,
  Weekly = 1,
  Monthly = 2,
  Yearly = 3,
}

export interface CreateEventDtoRequest {
  eventName: string
  eventDescription?: string | null
  groupId: number
  startTime: string
  endTime: string
  categoryId?: number | undefined
  location?: string | null
  isRecurring: boolean
  recurrencePattern?: RecurrencePattern | undefined
  recurrenceEndTime?: string | null
}

export interface CreateEventDtoResponse {
  eventId: number
  eventName: string
  eventDescription?: string
  groupId: number
  startTime: string
  endTime: string
  categoryId?: number
  location?: string
  isRecurring: boolean
  recurrencePattern?: RecurrencePattern
  recurringInstancesCreated?: number
  recurrenceEndTime?: string
}

/* =========================
   Delete Event
   ========================= */

export enum DeleteRecurringOption {
  ThisEventOnly = 0,
  ThisAndFutureEvents = 1,
  AllEvents = 2,
}

export interface DeleteEventDtoRequest {
  eventId: number
  deleteOption: DeleteRecurringOption
}

export interface DeleteEventDtoResponse {
  deletedCount: number
  message: string
}

/* =========================
   Get Group Events
   ========================= */

export interface GetAllGroupEventsResponse {
  eventId: number
  eventName?: string | null
  eventDescription?: string
  startTime: string
  endTime: string
  categoryId?: number | undefined
  categoryColor?: string | null
  categoryName?: string|null
  location?: string | null

  creatorUserId: string
  creatorUserName: string
  creatorUserEmail: string
  nickname?: string | null

  isRecurring: boolean
  recurrencePattern?: RecurrencePattern
  recurrenceEndTime?: string

  createdAt: string
  updatedAt?: string
}

/* =========================
   Update Event
   ========================= */

export enum UpdateRecurringOption {
  ThisEventOnly = 0,
  ThisAndFutureEvents = 1,
  AllEvents = 2,
}

export interface UpdateEventDtoRequest {
  eventId: number
  eventName: string
  eventDescription?: string | null
  startTime: string
  endTime: string
  categoryId?: number | undefined
  location?: string | null
  updateOption: UpdateRecurringOption
}

export interface UpdateEventDtoResponse {
  updatedCount: number
  message: string
}

export interface NextEventDtoResponse{
  eventName: string;
  startTime: string;
  endTime: string;
  categoryId: number;
  categoryColor: string;
}
