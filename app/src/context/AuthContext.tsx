import { createContext, useContext, useState } from "react";
import { saveTokens, clearTokens } from "../services/tokenStorage";
import { mockLogin} from "@/app/src/services/mockapi";
import {authService} from "@/app/src/services/auth.service";

type AuthContextType = {
    isSignedIn: boolean;
    user: any;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>(null as any);

export const AuthProvider = ({ children }: any) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [user, setUser] = useState<any>(null);

    const login = async (email: string, pass: string) => {
        const res = await authService.login({email, pass});
        await saveTokens(res.accessToken, res.refreshToken);
        setUser(res.user);
        setIsSignedIn(true);
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
        <AuthContext.Provider value={{ isSignedIn, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
