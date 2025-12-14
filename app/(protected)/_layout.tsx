import { Slot, Redirect } from "expo-router";
import { useAuth } from "@/app/src/context/AuthContext";

export default function ProtectedLayout() {
    const { isSignedIn } = useAuth();
    if (!isSignedIn) return <Redirect href="/(auth)/auth-screen" />;
    return <Slot />;
}
