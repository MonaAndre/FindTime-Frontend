import api from "@/plugins/axios";
import type { ServiceResponse } from "@/types/api"
import type { AddNewGroupMemberRequest, AddNicknameDtoRequest, ChangeGroupAdminRequest, CreateGroup, CreateGroupDtoResponse, DeleteMemberRequest, Group, GroupInfoDtoResponse, UpdateGroupInfoDtoRequest, UpdateUserGroupSettingsDtoRequest } from "@/types/group"

export const groupApi = {
    async getGroups(): Promise<ServiceResponse<Group[]>> {
        const response = await api.get<ServiceResponse<Group[]>>("/api/Group/get-all-groups");
        return response.data;
    },
    async createGroup(createGroupRequest: CreateGroup): Promise<ServiceResponse<CreateGroupDtoResponse>> {
        const response = await api.post<ServiceResponse<CreateGroupDtoResponse>>("/api/Group/create-group", createGroupRequest);
        return response.data;
    },
    async getGroupInfo(groupId: number): Promise<ServiceResponse<GroupInfoDtoResponse>> {
        const response = await api.get<ServiceResponse<GroupInfoDtoResponse>>(`api/Group/get-group/${groupId}`);
        return response.data;
    },
    async updateGroupInfo(updateGroupRequest: UpdateGroupInfoDtoRequest): Promise<ServiceResponse<boolean>> {
        const response = await api.post<ServiceResponse<boolean>>("api/Group/update-group-info", updateGroupRequest);
        return response.data;
    },
    async addNewGroupMember(addNewMember: AddNewGroupMemberRequest): Promise<ServiceResponse<boolean>> {
        const response = await api.post<ServiceResponse<boolean>>("api/Group/add-new-member", addNewMember);
        return response.data

    },
    async deleteMember(deleteMember: DeleteMemberRequest): Promise<ServiceResponse<boolean>> {
        const response = await api.post<ServiceResponse<boolean>>("api/Group/delete-member", deleteMember);
        return response.data;
    },
    async changeGroupAdmin(changeGroupAdmin: ChangeGroupAdminRequest): Promise<ServiceResponse<boolean>> {
        const response = await api.post<ServiceResponse<boolean>>("api/Group/change-group-admin", changeGroupAdmin);
        return response.data;
    },
    async leaveGroup(groupId: number): Promise<ServiceResponse<boolean>> {
        const response = await api.post<ServiceResponse<boolean>>(
            `api/Group/leave-group/${groupId}`
        );
        return response.data;
    },
    async deleteGroup(groupId: number): Promise<ServiceResponse<boolean>> {
        const res = await api.post<ServiceResponse<boolean>>(`api/Group/delete-group/${groupId}`);
        return res.data;
    },
    async addNickname(addNickname: AddNicknameDtoRequest): Promise<ServiceResponse<boolean>> {
        const res = await api.post<ServiceResponse<boolean>>("api/Group/add-nickname", addNickname);
        return res.data;
    },
    async updateUserGroupSettings(req: UpdateUserGroupSettingsDtoRequest): Promise<ServiceResponse<boolean>> {
        const res = await api.post<ServiceResponse<boolean>>("api/Group/update-user-settings", req);
        return res.data;
    },
}
