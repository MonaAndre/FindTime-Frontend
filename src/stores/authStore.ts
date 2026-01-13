import { authApi } from "@/endpoints/authEndpoints";
import type { LoginRequest, User } from "@/types/auth";
import axios from "axios";
import { defineStore } from "pinia";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}
export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        isAuthenticated: false,
    }),
    actions: {
        async login(request: LoginRequest) {
            try {
                const response = await authApi.login(request);
                if (response.statusCode == 200) {
                    this.user = response.data;
                    this.isAuthenticated = true;
                    console.log("user", this.user);
                    return response.data;
                } else {
                    console.log(response.message);
                    return response.message
                }


            } catch (error) {
                console.error("Login failed:", error);
                if (axios.isAxiosError(error) && error.response) {
                    return error.response.data;
                }
            }
        }
    }
});
