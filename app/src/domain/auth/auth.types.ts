export type AuthMode = "email" | "phone";
export type AuthStep = "method" | "login" | "signup" | "otp";

export interface RegisterPayload {
    name: string;
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
    verificationToken?: string;
    mode: "email" | "phone";
}
export interface SignInPayload{
    identifier: string;
    password: string;
}
export interface RequestOtpPayload{
    phoneNumber: string,
    mode: string
}
export interface VerifyOtpPayload{
    phoneNumber: string,
    otp:string,
    mode: string
}
export interface ResetPasswordPayload {
    confirmPassword: string;
    newPassword: string;
    verificationToken: string;
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
export interface OtpResponse{
    verificationToken: string,
}