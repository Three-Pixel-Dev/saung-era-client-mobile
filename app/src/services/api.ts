import axios from "axios";
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from "./tokenStorage";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

// Add access token to every request
api.interceptors.request.use(async (config) => {
    const token = await getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto-refresh tokens on 401
api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;

        if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = await getRefreshToken();
            if (!refreshToken) {
                await clearTokens();
                return Promise.reject(err);
            }

            try {
                const res = await axios.post("https://your-backend.com/auth/refresh", {
                    refreshToken,
                });

                await saveTokens(res.data.accessToken, res.data.refreshToken);

                originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
                return api(originalRequest);

            } catch (refreshErr) {
                await clearTokens();
                return Promise.reject(refreshErr);
            }
        }

        return Promise.reject(err);
    }
);

export default api;