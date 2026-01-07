import { create } from "zustand";
import { authService } from "@/app/src/domain/auth/auth.service";
import {RegisterPayload, TokenPayload} from "@/app/src/domain/auth/auth.types";
interface AuthStore {
    user: any | null;
    isLoading: boolean;
    error: string | null;
    tempRegisterData: RegisterPayload | null;

    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    requestSignupOtp: (data: RegisterPayload) => Promise<void>;
    completeRegistration: (otp: string) => Promise<void>;
    continueWithGoogle: (data: TokenPayload) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    user: null,
    isLoading: false,
    error: null,
    tempRegisterData: null,

    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),

    requestSignupOtp: async (data: RegisterPayload) => {
        set({ isLoading: true, error: null });

        try {
            await authService.verifyFields(data);

            set({ tempRegisterData: data });

            await authService.requestOtp({
                phoneNumber: data.phoneNumber,
                mode: "register"
            });
        } catch (err: any) {
            console.error("OTP Request failed", err);
            const msg = err.response?.data?.message || err.message || "Request failed.";
            set({ error: msg });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    completeRegistration: async (otp: string) => {
        const { tempRegisterData } = get();

        if (!tempRegisterData) {
            const msg = "Registration session expired. Please fill the form again.";
            set({ error: msg });
            throw new Error(msg);
        }

        set({ isLoading: true, error: null });

        try {
            const verifyResponse = await authService.verifyOtp({
                phoneNumber: tempRegisterData.phoneNumber,
                otp: otp,
                mode: "register"
            });
            const { verificationToken } = verifyResponse;
            if (!verificationToken) {
                throw new Error("Verification failed: No token received");
            }

            const registerResponse = await authService.register({
                ...tempRegisterData,
                verificationToken: verificationToken,
            });

            set({
                user: registerResponse.user,
                tempRegisterData: null
            });
        } catch (err: any) {
            console.error("Registration failed", err);
            const msg = err.response?.data?.message || err.message || "Invalid Code or Registration Failed";
            set({ error: msg });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },
    continueWithGoogle: async (data:TokenPayload) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.loginWithGoogle(data);
            set({ user: response.user });

            // Note: You should likely save tokens here (e.g. AsyncStorage)
            // await saveTokens(response.accessToken, response.refreshToken);

        } catch (err: any) {
            console.error("Google Login failed", err);
            const msg = err.response?.data?.message || "Google Sign-In failed";
            set({ error: msg });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },
}));