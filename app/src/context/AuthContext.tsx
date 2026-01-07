import { createContext, useContext, useState } from "react";
import { saveTokens, clearTokens } from "../services/tokenStorage";
import { mockLogin} from "@/app/src/services/mockapi";
import {authService} from "@/app/src/domain/auth/auth.service";
import {TokenPayload} from "@/app/src/domain/auth/auth.types";

type AuthContextType = {
    isSignedIn: boolean;
    user: any;
    login: (identifier: string, pass: string) => Promise<void>;
    continueWithGoogle: (data: TokenPayload) => Promise<void>;
    logout: () => Promise<void>;
    isVerifying:boolean;
};

const AuthContext = createContext<AuthContextType>(null as any);

export const AuthProvider = ({ children }: any) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const login = async (identifier: string, pass: string) => {
        const res = await authService.login({identifier, pass});
        await saveTokens(res.accessToken, res.refreshToken);
        setUser(res.user);
        setIsSignedIn(true);
    };
    const continueWithGoogle = async (data: TokenPayload) => {
        setIsVerifying(true);
        try {
            const res = await authService.loginWithGoogle(data);
            await saveTokens(res.accessToken, res.refreshToken);
            setUser(res.user);
            setIsSignedIn(true);
        } catch (err: any) {
            console.error("Verification failed", err);
            throw err;
        } finally {
            setIsVerifying(false);
        }
    };
    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout API failed", error);
        } finally {
            await clearTokens();
            setUser(null);
            setIsSignedIn(false);
        }
    };

    return (
        <AuthContext.Provider value={{ isSignedIn, user, login, logout,continueWithGoogle,isVerifying }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
