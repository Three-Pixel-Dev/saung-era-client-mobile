import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    Animated,
    Keyboard,
    Easing,
} from "react-native";
import {useState, useRef, useEffect} from "react";
import {useAuth} from "@/app/src/context/AuthContext";
import {theme} from "@/app/src/theme";
import {useRouter} from "expo-router";
import {Mail, Lock, User, Sparkles, AtSign} from "lucide-react-native";
import {AuthMode, AuthStep} from "@/app/src/domain/auth/auth.types";
import {CustomButton} from "@/app/src/components/CustomButton";
import {CustomInput} from "@/app/src/components/CustomInput";
import {FontAwesome} from "@expo/vector-icons";
import {authService} from "@/app/src/services/auth.service";
import {ScreenWrapper} from "@/app/src/components/ScreenWrapper";
import {SlidingTabs} from "@/app/src/components/SlidingTabs";
import {AlertBlock} from "@/app/src/components/AlertBlock";

export default function AuthScreen() {
    const {login} = useAuth();
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

    // Page Transition
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
                await authService.register({name, username, email, phone, pass, mode});
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
        <ScreenWrapper contentContainerStyle={styles.container}>
            {/* --- HEADER --- */}
            <View style={styles.header}>
                <View style={styles.logoBadge}>
                    <Sparkles size={32} color={theme.colors.gray900}/>
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
            <AlertBlock message={error} type="error" onDismiss={() => setError(null)} />
            <AlertBlock message={successMessage} type="success" onDismiss={() => setSuccessMessage(null)} />

            {/* --- MAIN FORM --- */}
            <Animated.View style={[styles.formContainer, animatedStyle]}>

                {step === 'login' && (
                    <SlidingTabs
                        tabs={['email', 'phone']}
                        activeTab={mode}
                        onTabChange={(t) => setMode(t as AuthMode)}
                    />
                )}

                {step === "signup" && (
                    <>
                        <CustomInput icon={User} placeholder="Full name" value={name} onChangeText={setName}/>
                        <CustomInput icon={AtSign} placeholder="Username" value={username}
                                     onChangeText={(t: string) => setUsername(t.toLowerCase().replace(/\s/g, ''))}
                                     autoCapitalize="none"/>
                        <CustomInput icon={Mail} placeholder="Email address" value={email} onChangeText={setEmail}
                                     keyboardType="email-address"/>
                        <CustomInput prefixText="+95" placeholder="9 XXX XXX XXX" value={phone}
                                     onChangeText={(t: string) => setPhone(t.replace(/\D/g, ""))}
                                     keyboardType="phone-pad"/>
                    </>
                )}

                {step === "login" && (
                    mode === "email" ? (
                        <CustomInput icon={Mail} placeholder="Email address" value={email} onChangeText={setEmail}
                                     keyboardType="email-address"/>
                    ) : (
                        <CustomInput prefixText="+95" placeholder="9 XXX XXX XXX" value={phone}
                                     onChangeText={(t: string) => setPhone(t.replace(/\D/g, ""))}
                                     keyboardType="phone-pad"/>
                    )
                )}

                <CustomInput icon={Lock} placeholder="Password" value={pass} onChangeText={setPass} secureTextEntry/>

                <CustomButton onPress={handleLogin} disabled={loading} style={styles.primaryButton}>
                    {loading ? (
                        <ActivityIndicator color={theme.colors.white}/>
                    ) : (
                        step === "signup" ? "Create Account" : "Sign In"
                    )}
                </CustomButton>

                {step === "signup" && (
                    <TouchableOpacity
                        onPress={() => {
                            setStep("login");
                        }}
                        style={styles.linkButtonBack}
                    >
                        <Text style={styles.linkText}>← Back to login options</Text>
                    </TouchableOpacity>
                )}
            </Animated.View>

            <View style={styles.footerContainer}>
                <View style={styles.divider}>
                    <View style={styles.dividerLine}/>
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.dividerLine}/>
                </View>

                <CustomButton variant="social" onPress={handleGoogleLogin} disabled={loading}>
                    <FontAwesome name={"google"} size={20} color={"black"} style={styles.googleIcon}/>
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
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
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
            ios: {
                shadowColor: theme.colors.primary,
                shadowOffset: {width: 0, height: 4},
                shadowOpacity: 0.3,
                shadowRadius: 5
            },
            android: {elevation: 8},
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
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        zIndex: 10,
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
    linkButtonBack: {
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