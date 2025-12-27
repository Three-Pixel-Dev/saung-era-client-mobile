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
import { Mail, Phone, Lock, User, Sparkles, X, AtSign, CheckCircle } from "lucide-react-native";
import { AuthMode, AuthStep } from "@/app/src/domain/auth/auth.types";
import { CustomButton } from "@/app/src/components/CustomButton";
import { CustomInput } from "@/app/src/components/CustomInput";
import { FontAwesome } from "@expo/vector-icons";
import { authService } from "@/app/src/services/auth.service";

export default function AuthScreen() {
    const { login } = useAuth();
    const [mode, setMode] = useState<AuthMode>("email");
    const [step, setStep] = useState<AuthStep>("login");

    // Form State
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [pass, setPass] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");

    // UI State
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [tabContainerWidth, setTabContainerWidth] = useState(0);

    const router = useRouter();

    // --- ANIMATION SETUP ---
    const stepAnim = useRef(new Animated.Value(0)).current;
    const tabAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        setError(null);
        setSuccessMessage(null);
        stepAnim.setValue(0);
        Animated.timing(stepAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: false,
            easing: Easing.out(Easing.back(1.5)),
        }).start();
    }, [step]);

    useEffect(() => {
        Animated.timing(tabAnim, {
            toValue: mode === 'email' ? 0 : 1,
            duration: 250,
            useNativeDriver: false,
            easing: Easing.inOut(Easing.ease),
        }).start();
    }, [mode]);

    // --- INTERPOLATIONS ---

    // 1. Text Colors (Smooth transition)
    const textColorEmail = tabAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.colors.white, theme.colors.gray500]
    });

    const textColorPhone = tabAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.colors.gray500, theme.colors.white]
    });

    // 2. Slider Movement
    const sliderWidth = tabContainerWidth > 0 ? (tabContainerWidth - 4) / 2 : 0;

    const sliderAnimatedStyle = {
        transform: [
            {
                translateX: tabAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, sliderWidth],
                }),
            },
        ],
    };

    // 3. Page Transition
    const animatedStyle = {
        opacity: stepAnim,
        transform: [
            {
                scale: stepAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.92, 1],
                }),
            },
        ],
    };

    // -----------------------

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
                    // Phone login logic
                }
                router.replace("/(protected)/(shop)");
            } else if (step === 'signup') {
                if (!name || !username || !email || !phone || !pass) {
                    throw new Error("Please fill in all required fields.");
                }
                await authService.register({ name, username, email, phone, pass, mode });
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

    const toggleStep = () => {
        setStep(prev => prev === "login" ? "signup" : "login");
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

                            {/* --- HEADER --- */}
                            <View style={styles.header}>
                                <View style={styles.logoBadge}>
                                    <Sparkles size={32} color={theme.colors.gray900} />
                                </View>
                                <Text style={styles.title}>
                                    {step === "login" ? "Welcome Back" : "Create Account"}
                                </Text>
                                <Text style={styles.subtitle}>
                                    {step === "login"
                                        ? "Enter your credentials to access your account"
                                        : "Fill in the details below to join us"}
                                </Text>
                            </View>

                            {/* --- ALERTS --- */}
                            <Animated.View style={[styles.alertContainer, animatedStyle]}>
                                {error && (
                                    <View style={styles.errorBox}>
                                        <Text style={styles.errorText}>{error}</Text>
                                        <TouchableOpacity onPress={() => setError(null)}>
                                            <X size={16} color={theme.colors.error} />
                                        </TouchableOpacity>
                                    </View>
                                )}
                                {successMessage && (
                                    <View style={styles.successBox}>
                                        <View style={{flexDirection: 'row', alignItems:'center', gap: 8, flex: 1}}>
                                            <CheckCircle size={20} color="#15803d" />
                                            <Text style={styles.successText}>{successMessage}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => setSuccessMessage(null)}>
                                            <X size={16} color="#15803d" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </Animated.View>

                            {/* --- MAIN FORM --- */}
                            <Animated.View style={[styles.formContainer, animatedStyle]}>

                                {step === 'login' && (
                                    <View
                                        style={styles.tabContainer}
                                        onLayout={(e) => setTabContainerWidth(e.nativeEvent.layout.width)}
                                    >
                                        {/* THE MOVING BACKGROUND SLIDER - FLAT */}
                                        {sliderWidth > 0 && (
                                            <Animated.View
                                                style={[
                                                    styles.activeSlider,
                                                    { width: sliderWidth },
                                                    sliderAnimatedStyle
                                                ]}
                                            />
                                        )}

                                        {/* THE CLICKABLE TABS */}
                                        <TouchableOpacity
                                            style={styles.tab}
                                            onPress={() => setMode('email')}
                                            activeOpacity={0.8}
                                        >
                                            <Animated.Text style={[styles.tabText, { color: textColorEmail }]}>
                                                Email
                                            </Animated.Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.tab}
                                            onPress={() => setMode('phone')}
                                            activeOpacity={0.8}
                                        >
                                            <Animated.Text style={[styles.tabText, { color: textColorPhone }]}>
                                                Phone
                                            </Animated.Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {step === "signup" && (
                                    <>
                                        <CustomInput icon={User} placeholder="Full name" value={name} onChangeText={setName} />
                                        <CustomInput icon={AtSign} placeholder="Username" value={username} onChangeText={(t:string) => setUsername(t.toLowerCase().replace(/\s/g, ''))} autoCapitalize="none" />
                                        <CustomInput icon={Mail} placeholder="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" />
                                        <CustomInput prefixText="+95" placeholder="9 XXX XXX XXX" value={phone} onChangeText={(t: string) => setPhone(t.replace(/\D/g, ""))} keyboardType="phone-pad" />
                                    </>
                                )}

                                {step === "login" && (
                                    mode === "email" ? (
                                        <CustomInput icon={Mail} placeholder="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" />
                                    ) : (
                                        <CustomInput prefixText="+95" placeholder="9 XXX XXX XXX" value={phone} onChangeText={(t: string) => setPhone(t.replace(/\D/g, ""))} keyboardType="phone-pad" />
                                    )
                                )}

                                <CustomInput icon={Lock} placeholder="Password" value={pass} onChangeText={setPass} secureTextEntry />

                                <CustomButton onPress={handleLogin} disabled={loading} style={styles.primaryButton}>
                                    {loading ? (
                                        <ActivityIndicator color={theme.colors.white} />
                                    ) : (
                                        step === "signup" ? "Create Account" : "Sign In"
                                    )}
                                </CustomButton>

                                {step === "signup" && (
                                    <TouchableOpacity
                                        onPress={() => { setStep("login"); }}
                                        style={styles.linkButtonBack}
                                    >
                                        <Text style={styles.linkText}>← Back to login options</Text>
                                    </TouchableOpacity>
                                )}
                            </Animated.View>

                            <View style={styles.footerContainer}>
                                <View style={styles.divider}>
                                    <View style={styles.dividerLine} />
                                    <Text style={styles.dividerText}>OR</Text>
                                    <View style={styles.dividerLine} />
                                </View>

                                <CustomButton variant="social" onPress={handleGoogleLogin} disabled={loading}>
                                    <FontAwesome name={"google"} size={20} color={"black"} style={styles.googleIcon} />
                                    <Text style={styles.buttonTextSocial}>Continue with Google</Text>
                                </CustomButton>

                                <TouchableOpacity onPress={toggleStep} style={styles.linkButton}>
                                    <Text style={styles.linkText}>
                                        {step === 'login' ? "Don't have an account? " : "Already have an account? "}
                                        <Text style={styles.linkTextPrimary}>
                                            {step === 'login' ? "Sign up" : "Sign in"}
                                        </Text>
                                    </Text>
                                </TouchableOpacity>
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
        paddingVertical: 20,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        paddingHorizontal: theme.spacing.xl,
        maxWidth: 500,
        width: '100%',
        alignSelf: 'center',
    },
    header: {
        alignItems: "center",
        marginBottom: 30,
    },
    logoBadge: {
        width: 64,
        height: 64,
        borderRadius: 18,
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
        fontSize: 28,
        fontWeight: "bold",
        color: theme.colors.gray900,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.gray500,
        textAlign: "center",
    },

    // --- UPDATED TAB STYLES ---
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.gray200,
        padding: 2,
        borderRadius: 10,
        marginBottom: 20,
        position: 'relative',
        height: 50,
    },
    activeSlider: {
        position: 'absolute',
        top: 2,
        left: 2,
        bottom: 2,
        backgroundColor: theme.colors.primary,
        borderRadius: 8,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        zIndex: 10,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
    },

    formContainer: {
        width: "100%",
        marginBottom: 20,
        alignItems: 'center',
    },
    primaryButton: {
        marginTop: 10,
        width: '100%',
    },
    alertContainer: {
        width: '100%',
        marginBottom: 10,
    },
    errorBox: {
        backgroundColor: `${theme.colors.error}10`,
        borderWidth: 1,
        borderColor: theme.colors.error,
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    errorText: {
        color: theme.colors.error,
        fontSize: 13,
        flex: 1,
        marginRight: 10,
    },
    successBox: {
        backgroundColor: "#dcfce7",
        borderWidth: 1,
        borderColor: "#15803d",
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    successText: {
        color: "#15803d",
        fontSize: 13,
        flex: 1,
        fontWeight: '600',
    },
    footerContainer: {
        width: '100%',
    },
    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.gray300,
    },
    dividerText: {
        paddingHorizontal: 10,
        fontSize: 12,
        color: theme.colors.gray500,
        fontWeight: '600',
    },
    buttonTextSocial: {
        color: theme.colors.gray900,
        fontWeight: '500',
    },
    googleIcon: {
        marginRight: 10,
    },
    linkButton: {
        marginTop: 24,
        padding: 10,
        alignItems: 'center',
    },
    linkButtonBack:{
        padding: 10,
        alignItems: 'center',
    },
    linkText: {
        fontSize: 14,
        color: theme.colors.gray500,
    },
    linkTextPrimary: {
        color: theme.colors.primary,
        fontWeight: "600",
    },
});