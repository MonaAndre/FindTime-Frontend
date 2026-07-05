export enum ActivityType {
  EventCreated = 0,
  EventUpdated = 1,
  EventDeleted = 2,
  MemberJoined = 3,
  RsvpResponse = 4,
}

export interface ActivityDtoResponse {
  activityId: number
  type: ActivityType
  actorUserId: string
  actorFirstName: string
  actorLastName: string
  groupId: number
  groupName: string
  eventId: number | null
  eventName: string | null
  createdAt: string
}
