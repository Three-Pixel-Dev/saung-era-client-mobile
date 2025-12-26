import api from "./api";
import { saveTokens } from "./tokenStorage";

export interface RegisterPayload {
    name: string;
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
}
export interface SignInPayload{
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: number;
        name: string;
        username: string;
        email: string;
        phoneNumber: string;
        createdAt: string;
    };
}

export const authService = {
    register: async (data: {
        name: string;
        username: string,
        email: string;
        phone: string;
        pass: string;
        mode: "email" | "phone";
    }) => {
        const payload: RegisterPayload = {
            name: data.name,
            username: data.username,
            email: data.mode === "email" ? data.email : "",
            phoneNumber: data.mode === "phone" ? data.phone : "",
            password: data.pass,
        };

        const response = await api.post<AuthResponse>("/api/client/auth/register", payload);

        // if (response.data.accessToken && response.data.refreshToken) {
        //     await saveTokens(response.data.accessToken, response.data.refreshToken);
        // }

        return response.data;
    },
    login: async(data: {
        email: string;
        pass: string;
    })=>{
        const payload: SignInPayload={
            email: data.email,
            password: data.pass
        };
        const response = await api.post<AuthResponse>("/api/client/auth/login",payload);
        return response.data;
    },
    logout: async () => {
        await api.post("/api/client/auth/logout");
    }
};