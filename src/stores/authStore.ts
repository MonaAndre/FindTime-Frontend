import { authApi } from "@/endpoints/authEndpoints";
import type { LoginRequest, User } from "@/types/auth";
import axios from "axios";
import { defineStore } from "pinia";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
}
export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        isAuthenticated: false,
        isInitialized: false
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
        },
        async logout() {
            try {
                const response = await authApi.logout();
                if (response.statusCode == 200) {
                    this.user = null;
                    this.isAuthenticated = false;
                    console.log("user is logedout");
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
        },
        async checkAuth() {
            try {
                const response = await authApi.me(); 
                if (response.statusCode === 200 && response.data) {
                    this.user = response.data;
                    this.isAuthenticated = true;
                } else {
                    this.user = null;
                    this.isAuthenticated = false;
                }
            } catch (error) {
                this.user = null;
                this.isAuthenticated = false;
                console.log("User not authenticated", error);
            } finally {
                this.isInitialized = true;
            }
        }
    }

});
