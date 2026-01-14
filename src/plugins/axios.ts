import { useAuthStore } from "@/stores/authStore";
import axios, { AxiosError } from "axios";
import router from '@/router';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5223',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})
api.interceptors.response.use((res) => {
    return res;
}
    , async (error: AxiosError) => {
        const originalRequest = error.config;
        if (!originalRequest) {
            return Promise.reject(error);
        }
        if (error.response?.status == 401) {
            handleAuthenticationFailure();
            return Promise.reject(error);
        }
        if (error.response?.status == 403) {
            handleAuthenticationFailure();
            return Promise.reject(error);
        }
        return Promise.reject(error);
    });

const handleAuthenticationFailure = () => {
    const authStore = useAuthStore();
    authStore.user = null;
    authStore.isAuthenticated = true;
    router.push({ path: "/login" });
}

export default api;