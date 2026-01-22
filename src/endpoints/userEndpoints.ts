import api from "@/plugins/axios";
import type { ServiceResponse } from "@/types/api";
import type { UserDto } from "@/types/user";

export const userApi = {
    async getUser(): Promise<ServiceResponse<UserDto>> {
        const response = await api.get<ServiceResponse<UserDto>>("/api/User/get-user");
        return response.data;
    },
    async updateUser(user: UserDto): Promise<ServiceResponse<boolean>> {
        const response = await api.post<ServiceResponse<boolean>>("/api/User/update-user", user);
        return response.data;
    },
    async deleteUser(): Promise<ServiceResponse<boolean>> {
        const response = await api.delete<ServiceResponse<boolean>>("/api/User/delete-user");
        return response.data;
    }
}