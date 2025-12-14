import { AuthProvider} from "@/app/src/context/AuthContext";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
export default function RootLayout() {
  return (
      <>
          <StatusBar style="dark" />
          <AuthProvider>
              <SafeAreaProvider>
                  <Slot />
              </SafeAreaProvider>
          </AuthProvider>
      </>
  );
}
