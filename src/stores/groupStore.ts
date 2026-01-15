import { GroupApi } from "@/endpoints/groupEndpoints";
import type { Group } from "@/types/group";
import axios from "axios";
import { defineStore } from "pinia";

interface GroupState {
    groups: Group[];
}

export const useGroupStore = defineStore('group', {
    state: (): GroupState => ({

        groups: [] as Group[],
    }),
    actions: {
        async getGroups() {
            try {
                const response = await GroupApi.getGroups();
                if (response.success && response.data) {
                    this.groups = response.data
                    // console.log("groups: ", this.groups);
                    return response
                } else {
                    console.log(response.message);
                    return response
                }

            } catch (error) {
                console.error("fetching groups failed:", error);
                if (axios.isAxiosError(error) && error.response) {
                    return {
                        success: false,
                        data: [],
                        message: error instanceof Error ? error.message : 'Failed to fetch groups'
                    };
                }
                return {
                    success: false,
                    data: [],
                    message: 'Failed to fetch groups',
                    statusCode: 500
                };
            }
        }
    }

}

)