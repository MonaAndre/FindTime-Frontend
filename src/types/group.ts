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
export interface CreateGroup {
    description: string | null
    groupName: string
    membersEmails: string[]
}
export interface CreateGroupDtoResponse {
    groupId: number;
    groupName: string;
    adminEmail: string;
    members: GroupMemberDto[];
    failedEmails: string[];
}

export interface GroupMemberDto {
    email: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
}
export interface GroupInfoDtoResponse {
    groupId: number;
    groupName: string;
    description?: string | null;
    adminEmail: string;
    adminName: string;
    isAdmin: boolean;
    memberCount: number;
    createdAt: string;
    joinedAt: string;
    userGroupColor?: string | null;
    members: GroupMemberGroupDto[];
}

export interface GroupMemberGroupDto {
    userId: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    profilePictureLink?: string | null;
    joinedAt: string;
    isAdmin: boolean;
    nickname?: string | null;
}
export interface UpdateGroupInfoDtoRequest {
    groupId: number;
    groupName: string;
    description?: string | null;
}

export interface AddNewGroupMemberRequest {
    groupId: number;
    userEmail: string;
}
export interface DeleteMemberRequest {
    userId: string;
    groupId: number;
}
export interface ChangeGroupAdminRequest{
    groupId: number;
    newAdminUserId: string;
}
export interface AddNicknameDtoRequest {
  targetUserId: string;
  nickname: string;
  groupId: number;
}
export interface UpdateUserGroupSettingsDtoRequest{
    groupId: number;
    groupColor: string;
}


