import axios, { AxiosError } from "axios";

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
            // handleAuthenticationFailure();
            return Promise.reject(error);
        }
        if (error.response?.status == 403) {
            // handleAuthorizationFailure();
            return Promise.reject(error);
        }
        return Promise.reject(error);
    });

// const handleAuthenticationFailure = () => {

// }

export default api;