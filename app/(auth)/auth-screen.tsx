import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Animated,
    Keyboard,
    Easing,
    ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/app/src/context/AuthContext";
import { theme } from "@/app/src/theme";
import { useRouter } from "expo-router";
import { Mail, Phone, Lock, User, ArrowRight, Sparkles, X, AtSign, CheckCircle } from "lucide-react-native"; // Added CheckCircle
import { AuthMode, AuthStep } from "@/app/src/domain/auth/auth.types";
import { CustomButton } from "@/app/src/components/CustomButton";
import { CustomInput } from "@/app/src/components/CustomInput";
import { FontAwesome } from "@expo/vector-icons";
import { authService } from "@/app/src/services/auth.service";

export default function AuthScreen() {
    const { login } = useAuth();
    const [mode, setMode] = useState<AuthMode>("email");
    const [step, setStep] = useState<AuthStep>("method");

    // Form State
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [pass, setPass] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");

    // UI State
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // New State
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const stepAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (step !== 'login') {
            setSuccessMessage(null);
            setError(null);
        }

        stepAnim.setValue(0);
        Animated.timing(stepAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.back(1.5)),
        }).start();
    }, [step]);

    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        Keyboard.dismiss();

        try {
            if (step === 'login') {
                if (mode === 'email') {
                    await login(email, pass);
                } else {
                    // Implement phone login if backend supports it
                }
                router.replace("/(protected)/(shop)");

            } else if (step === 'signup') {
                if (!name || !username || !email || !phone || !pass) {
                    throw new Error("Please fill in all required fields.");
                }

                await authService.register({
                    name,
                    username,
                    email,
                    phone,
                    pass,
                    mode
                });

                setLoading(false);
                setStep("login");
                setSuccessMessage("Account registration successful! Please log in.");

            }
        } catch (err: any) {
            console.error("Auth failed", err);
            const apiMessage = err.response?.data?.message || err.response?.data?.error;
            setError(apiMessage || err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setLoading(true);
        setTimeout(() => {
            router.push("/(protected)/(shop)");
            setLoading(false);
        }, 1500);
    };

    const isLoginOrSignup: boolean = step === "login" || step === "signup";

    const getHeaderTitle = () => {
        if (step === "signup") return "Create Account";
        if (step === "login") return "Welcome Back";
        return "Sign In";
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.container}>
                            <View style={styles.logoContainer}>
                                <View style={styles.logoBadge}>
                                    <Sparkles size={40} color={theme.colors.gray900} />
                                </View>
                                <Text style={styles.title}>{getHeaderTitle()}</Text>
                                <Text style={styles.subtitle}>
                                    {step === 'method'
                                        ? "Your premium shopping destination"
                                        : (step === 'login' ? `Sign in with your ${mode}` : 'Enter your details')
                                    }
                                </Text>
                            </View>

                            {/* --- ERROR MESSAGE --- */}
                            {error && (
                                <View style={styles.errorBox}>
                                    <Text style={styles.errorText}>{error}</Text>
                                    <TouchableOpacity onPress={() => setError(null)} style={styles.errorClose}>
                                        <X size={16} color={theme.colors.error} />
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* --- SUCCESS MESSAGE --- */}
                            {successMessage && (
                                <View style={styles.successBox}>
                                    <View style={{flexDirection: 'row', alignItems:'center', gap: 8, flex: 1}}>
                                        <CheckCircle size={20} color="#15803d" />
                                        <Text style={styles.successText}>{successMessage}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => setSuccessMessage(null)} style={styles.errorClose}>
                                        <X size={16} color="#15803d" />
                                    </TouchableOpacity>
                                </View>
                            )}

                            <Animated.View
                                style={{
                                    opacity: stepAnim,
                                    transform: [{
                                        scale: stepAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.95, 1],
                                        }),
                                    }],
                                    width: '100%'
                                }}
                            >
                                {step === "method" && (
                                    <View style={styles.formContainer}>
                                        <CustomButton variant="social" onPress={handleGoogleLogin} disabled={loading}>
                                            <FontAwesome name={"google"} size={20} color={"black"} style={styles.googleIcon} />
                                            <Text style={styles.buttonTextSocial}>Continue with Google</Text>
                                        </CustomButton>

                                        <View style={styles.divider}>
                                            <View style={styles.dividerLine} />
                                            <Text style={styles.dividerText}>OR</Text>
                                            <View style={styles.dividerLine} />
                                        </View>

                                        <View style={styles.toggleContainer}>
                                            <CustomButton
                                                variant={mode === "email" ? "default" : "outline"}
                                                style={[styles.toggleButton, mode !== "email" && styles.buttonOutline]}
                                                onPress={() => setMode("email")}
                                                disabled={loading}
                                            >
                                                <Mail size={16} color={mode === "email" ? theme.colors.white : theme.colors.primary} />
                                                <Text style={[styles.toggleText, mode !== "email" && styles.toggleTextOutline]}>Email</Text>
                                            </CustomButton>
                                            <CustomButton
                                                variant={mode === "phone" ? "default" : "outline"}
                                                style={[styles.toggleButton, mode !== "phone" && styles.buttonOutline]}
                                                onPress={() => setMode("phone")}
                                                disabled={loading}
                                            >
                                                <Phone size={16} color={mode === "phone" ? theme.colors.white : theme.colors.primary} />
                                                <Text style={[styles.toggleText, mode !== "phone" && styles.toggleTextOutline]}>Phone</Text>
                                            </CustomButton>
                                        </View>

                                        <CustomButton
                                            onPress={() => setStep("login")}
                                            disabled={loading}
                                            style={styles.continueButton}
                                        >
                                            <Text style={styles.buttonTextDefault}>Continue</Text>
                                            <ArrowRight size={18} color={theme.colors.white} style={{ marginLeft: 8 }} />
                                        </CustomButton>
                                        <TouchableOpacity onPress={() => setStep("signup")} style={styles.linkButton}>
                                            <Text style={styles.linkText}> Don&#39;t have an account? <Text style={styles.linkTextPrimary}>Sign up</Text></Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {isLoginOrSignup && (
                                    <View style={styles.formContainer}>
                                        {step === "signup" && (
                                            <>
                                                <CustomInput
                                                    icon={User}
                                                    placeholder="Full name"
                                                    value={name}
                                                    onChangeText={setName}
                                                />
                                                <CustomInput
                                                    icon={AtSign}
                                                    placeholder="Username"
                                                    value={username}
                                                    onChangeText={(text:string) => setUsername(text.toLowerCase().replace(/\s/g, ''))}
                                                    autoCapitalize="none"
                                                />
                                                <CustomInput
                                                    icon={Mail}
                                                    placeholder="Email address"
                                                    value={email}
                                                    onChangeText={setEmail}
                                                    keyboardType="email-address"
                                                />
                                                <CustomInput
                                                    prefixText="+95"
                                                    placeholder="9 XXX XXX XXX"
                                                    value={phone}
                                                    onChangeText={(text: string) => setPhone(text.replace(/\D/g, ""))}
                                                    keyboardType="phone-pad"
                                                />
                                            </>
                                        )}

                                        {step === "login" && (
                                            mode === "email" ? (
                                                <CustomInput
                                                    icon={Mail}
                                                    placeholder="Email address"
                                                    value={email}
                                                    onChangeText={setEmail}
                                                    keyboardType="email-address"
                                                />
                                            ) : (
                                                <CustomInput
                                                    prefixText="+95"
                                                    placeholder="9 XXX XXX XXX"
                                                    value={phone}
                                                    onChangeText={(text: string) => setPhone(text.replace(/\D/g, ""))}
                                                    keyboardType="phone-pad"
                                                />
                                            )
                                        )}

                                        <CustomInput
                                            icon={Lock}
                                            placeholder="Password"
                                            value={pass}
                                            onChangeText={setPass}
                                            secureTextEntry
                                        />

                                        <CustomButton onPress={handleLogin} disabled={loading} style={styles.continueButton}>
                                            {loading ? (
                                                <ActivityIndicator color={theme.colors.white} />
                                            ) : (
                                                step === "signup" ? "Create Account" : "Sign In"
                                            )}
                                        </CustomButton>

                                        <TouchableOpacity onPress={() => { setStep("method"); setError(null); }} style={styles.linkButton}>
                                            <Text style={styles.linkText}>
                                                ← Back to login options
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </Animated.View>

                            <View style={styles.footerDecoration}>
                                <Text style={styles.linkText}>© 2025 Saung Era online shop. All rights reserved.</Text>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        paddingVertical: 20,
    },
    container: {
        flex: 1,
        paddingHorizontal: theme.spacing.xl,
        justifyContent: "space-between",
        alignItems: "center",
    },
    logoContainer: {
        alignItems: "center",
        paddingTop: 10,
        marginBottom: 20,
    },
    logoBadge: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: theme.colors.primary,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: theme.spacing.md,
        ...Platform.select({
            ios: { shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
            android: { elevation: 8 },
        }),
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: theme.colors.gray900,
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.gray700,
        textAlign: "center",
        marginBottom: theme.spacing.lg,
    },
    formContainer: {
        width: "100%",
        maxWidth: 400,
        marginBottom: 20,
    },
    // --- Button Styles ---
    buttonOutline: {
        backgroundColor: theme.colors.white,
        borderColor: theme.colors.primary,
        borderWidth: 1,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
    },
    buttonTextDefault: {
        color: theme.colors.white,
    },
    buttonTextSocial: {
        color: theme.colors.gray900,
    },
    googleIcon: {
        marginRight: 10,
    },
    continueButton: {
        marginTop: theme.spacing.sm,
    },
    // --- Divider Styles ---
    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: theme.spacing.md,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.gray300,
    },
    dividerText: {
        width: 30,
        textAlign: "center",
        fontSize: 12,
        color: theme.colors.gray500,
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    // --- Toggle Styles ---
    toggleContainer: {
        flexDirection: "row",
        gap: 10,
        marginBottom: theme.spacing.md,
    },
    toggleButton: {
        flex: 1,
        height: 48,
        marginBottom: 0,
        gap: 8,
    },
    toggleText: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.white,
    },
    toggleTextOutline: {
        color: theme.colors.primary,
    },
    // --- Link/Error Styles ---
    linkButton: {
        marginTop: theme.spacing.md,
        padding: 5,
        alignItems: 'center',
    },
    linkText: {
        textAlign: "center",
        fontSize: 14,
        color: theme.colors.gray500,
    },
    linkTextPrimary: {
        color: theme.colors.primary,
        fontWeight: "600",
    },
    errorBox: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: `${theme.colors.error}10`,
        borderWidth: 1,
        borderColor: theme.colors.error,
        borderRadius: 8,
        padding: theme.spacing.sm,
        marginBottom: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    // --- NEW SUCCESS STYLE ---
    successBox: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: "#dcfce7", // light green
        borderWidth: 1,
        borderColor: "#15803d", // dark green border
        borderRadius: 8,
        padding: theme.spacing.sm,
        marginBottom: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    successText: {
        color: "#15803d",
        fontSize: 14,
        flexShrink: 1,
        fontWeight: '600',
    },
    errorText: {
        color: theme.colors.error,
        fontSize: 14,
        flexShrink: 1,
        paddingRight: theme.spacing.sm,
    },
    errorClose: {
        padding: 5,
    },
    footerDecoration: {
        paddingBottom: theme.spacing.sm,
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
    }
});