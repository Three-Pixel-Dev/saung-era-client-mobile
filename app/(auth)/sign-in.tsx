import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useState } from "react";
import { useAuth } from "@/app/src/context/AuthContext";
import { theme } from "@/app/src/theme";
import { useRouter } from "expo-router";

export default function SignIn() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await login(email, pass);
            router.push('/(shop)');
        } catch (err: any) {
            console.log("Login failed", err);
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign In</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={pass}
                onChangeText={setPass}
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <Button title={loading ? "Logging in..." : "Login"} onPress={handleLogin} disabled={loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing.md,
        justifyContent: "center",
        backgroundColor: theme.colors.background,
    },
    title: {
        fontSize: 24,
        marginBottom: theme.spacing.md,
        color: theme.colors.gray900,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.gray300,
        padding: theme.spacing.sm,
        marginBottom: theme.spacing.md,
        borderRadius: 6,
    },
    error: {
        color: theme.colors.error,
        marginBottom: theme.spacing.md,
    },
});
