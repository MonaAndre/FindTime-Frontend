import api from "@/plugins/axios";
import type { ServiceResponse } from "@/types/api";
import type { AuthResponse, LoginRequest } from "@/types/auth";

export const authApi = {
    async login(LoginRequest: LoginRequest): Promise<ServiceResponse<AuthResponse>> {
        const response = await api.post<ServiceResponse<AuthResponse>>("/api/Auth/login", LoginRequest);
        return response.data;
    }
}