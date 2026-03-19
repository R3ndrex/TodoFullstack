import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
interface RefreshResponse {
    accessToken: string;
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

let accessToken: string | null = null;

export const setAccessToken = (token: string | null): void => {
    accessToken = token;
};

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original: RetryableRequestConfig = error.config;
        const isRefreshCall = original.url?.includes("/auth/refresh");

        if (
            error.response?.status === 401 &&
            !original._retry &&
            !isRefreshCall
        ) {
            original._retry = true;
            try {
                const { data } = await axios.post<RefreshResponse>(
                    "http://localhost:3000/api/auth/refresh",
                    {},
                    { withCredentials: true },
                );
                setAccessToken(data.accessToken);
                original.headers.set(
                    "Authorization",
                    `Bearer ${data.accessToken}`,
                );
                return api(original);
            } catch {
                setAccessToken(null);
                window.location.href = "/auth";
            }
        }
        return Promise.reject(error);
    },
);
export default api;
