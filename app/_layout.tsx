import { Stack } from "expo-router";
import { AuthProvider} from "@/app/src/context/AuthContext";

export default function RootLayout() {
  return (
      <>
          <AuthProvider>
              <Stack>
                  <Stack.Screen
                    name={"(shop)"}
                  />
              </Stack>
          </AuthProvider>
      </>
  );
}
