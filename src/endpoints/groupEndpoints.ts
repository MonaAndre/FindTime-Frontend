import api from "@/plugins/axios";
import type { ServiceResponse } from "@/types/api"
import type { Group } from "@/types/group"

export const groupApi = {


    async getGroups(): Promise<ServiceResponse<Group[]>> {
        const response = await api.get<ServiceResponse<Group[]>>("/api/Group/get-all-groups");
        return response.data;
    }
}
