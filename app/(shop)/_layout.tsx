import { useAuth} from "@/app/src/context/AuthContext";
import { Redirect, Slot } from "expo-router";

export default function ShopLayout() {
    const { isSignedIn } = useAuth();

    if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />;

    return <Slot />;
}
