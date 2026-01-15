import api from "@/plugins/axios";
import type { ServiceResponse } from "@/types/api";
import type { AuthResponse, LoginRequest } from "@/types/auth";

export const authApi = {
    async login(LoginRequest: LoginRequest): Promise<ServiceResponse<AuthResponse>> {
        const response = await api.post<ServiceResponse<AuthResponse>>("/api/Auth/login", LoginRequest);
        return response.data;
    },
    async logout(): Promise<ServiceResponse<boolean>> {
        const response = await api.post<ServiceResponse<boolean>>("/api/Auth/logout");
        return response.data;
    },
    async me(): Promise<ServiceResponse<AuthResponse>> {
        const response = await api.get<ServiceResponse<AuthResponse>>("/api/Auth/me");
        return response.data;
    }
}