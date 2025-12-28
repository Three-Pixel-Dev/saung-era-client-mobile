import api from "../../services/api";
import {
    RegisterPayload,
    SignInPayload,
    RequestOtpPayload,
    VerifyOtpPayload,
    ResetPasswordPayload,
    AuthResponse,
    OtpResponse
} from "@/app/src/domain/auth/auth.types";

export const authService = {
    register: async (data: RegisterPayload & { verificationToken: string }) => {
        const payload = {
            name: data.name,
            username: data.username,
            email: data.email,
            phoneNumber: data.phoneNumber,
            password: data.password,
            verificationToken: data.verificationToken,
        };

        const response = await api.post<AuthResponse>("/api/client/auth/register", payload);

        // if (response.data.accessToken && response.data.refreshToken) {
        //     await saveTokens(response.data.accessToken, response.data.refreshToken);
        // }

        return response.data;
    },
    verifyFields: async (data: RegisterPayload) => {
        const payload = {
            name: data.name,
            username: data.username,
            email: data.email,
            phoneNumber: data.phoneNumber,
            password: data.password,
        };

        const response = await api.post("/api/client/auth/verify", payload);

        return response.data;
    },
    login: async (data: {
        identifier: string;
        pass: string;
    }) => {
        const payload: SignInPayload = {
            identifier: data.identifier,
            password: data.pass
        };
        const response = await api.post<AuthResponse>("/api/client/auth/login", payload);
        return response.data;
    },
    logout: async () => {
        await api.post("/api/client/auth/logout");
    },
    requestOtp: async (data: RequestOtpPayload) => {
        const response = await api.post("/api/client/auth/request-otp", data);
        return response.data;
    },
    verifyOtp: async (data: VerifyOtpPayload) => {
        const response = await api.post<OtpResponse>("/api/client/auth/otp/verify", data);
        return response.data;
    },
    resetPassword: async (data: ResetPasswordPayload) => {
        const payload = {
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
            verificationToken: data.verificationToken,
        };
        const response = await api.post("/api/client/auth/password/change", payload);
        return response.data;
    }
};