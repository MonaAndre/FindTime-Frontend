export interface Group {
    groupId: number,
    groupName: string,
    description?: string,
    adminEmail: string,
    adminName: string,
    isAdmin: boolean,
    memberCount: number,
    createdAt: string,
    joinedAt: string
}
