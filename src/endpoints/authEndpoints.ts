import api from "@/plugins/axios";
import type { ServiceResponse } from "@/types/api";
import type { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";

export const authApi = {
    async login(loginRequest: LoginRequest): Promise<ServiceResponse<AuthResponse>> {
        const response = await api.post<ServiceResponse<AuthResponse>>("/api/Auth/login", loginRequest);
        return response.data;
    },
    async logout(): Promise<ServiceResponse<boolean>> {
        const response = await api.post<ServiceResponse<boolean>>("/api/Auth/logout");
        return response.data;
    },
    async me(): Promise<ServiceResponse<AuthResponse>> {
        const response = await api.get<ServiceResponse<AuthResponse>>("/api/Auth/me");
        return response.data;
    },
    async register(registerRequest: RegisterRequest): Promise<ServiceResponse<AuthResponse>> {
        const response = await api.post<ServiceResponse<AuthResponse>>("/api/Auth/register", registerRequest);
        return response.data;
    }
}