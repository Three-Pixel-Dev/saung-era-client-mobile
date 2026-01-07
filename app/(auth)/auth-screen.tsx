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
import {Mail, Lock, User, Sparkles, AtSign, KeyRound, ArrowLeft, Eye, EyeOff, Smartphone} from "lucide-react-native";
import {CustomButton} from "@/app/src/components/CustomButton";
import {CustomInput} from "@/app/src/components/CustomInput";
import {FontAwesome} from "@expo/vector-icons";
import {ScreenWrapper} from "@/app/src/components/ScreenWrapper";
import {SlidingTabs} from "@/app/src/components/SlidingTabs";
import {AlertBlock} from "@/app/src/components/AlertBlock";
import {useAuthStore} from "@/app/src/domain/auth/auth.store";
import {authService} from "@/app/src/domain/auth/auth.service";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {makeRedirectUri} from "expo-auth-session";
import {VerifyingOverlay} from "@/app/src/components/auth/VerifyingOverlay";

// Extended Types for local use
type AuthMode = 'email' | 'phone';
type AuthStep = 'login' | 'signup' | 'otp' | 'forgot-password' | 'reset-password';
type AuthFlow = 'auth' | 'recovery';
WebBrowser.maybeCompleteAuthSession();
export default function AuthScreen() {
    const {login,continueWithGoogle,isVerifying} = useAuth();
    const router = useRouter();

    // --- STATE ---
    const [mode, setMode] = useState<AuthMode>("email");
    const [step, setStep] = useState<AuthStep>("login");
    const [flow, setFlow] = useState<AuthFlow>('auth'); // New State: Track 'auth' vs 'recovery'

    // Form State
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhone] = useState("");
    const [password, setPass] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // New Field
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [recoveryToken, setRecoveryToken] = useState<string | null>(null);

    // UI State
    const [localError, setLocalError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [localLoading, setLocalLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // --- Google Auth ---
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        redirectUri: 'com.googleusercontent.apps.892803015558-sse4kp9lrn6j17trrie6e3dn3b3dfvm7:/(auth)',
    });

    // --- ZUSTAND STORE ---
    const {
        requestSignupOtp,
        completeRegistration,
        isLoading: isAuthLoading,
        error: authError,
        setError: setAuthError,
        setLoading: setAuthLoading
    } = useAuthStore();

    const isLoading = localLoading || isAuthLoading;
    const displayError = localError || authError;

    // --- ANIMATION ---
    const stepAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        console.log("rsponse use effect")
        if (response?.type === 'success') {
            const { id_token } = response.params;
            handleGoogleSignIn(id_token);
        } else if (response?.type === 'error') {
            setLocalError("Google sign-in cancelled or failed");
        }
    }, [response]);
    useEffect(() => {
        console.log("TESTING LOG");
        console.log("response is ",response)
    }, []);
    useEffect(() => {
        setLocalError(null);
        setAuthError(null);
        setSuccessMessage(null);

        setPass("");
        setConfirmPassword("");
        setOtpCode("");

        if (step === 'login') {
            setName("");
            setUsername("");
            setRecoveryToken(null);
        }

        stepAnim.setValue(0);
        Animated.timing(stepAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
            easing: Easing.out(Easing.back(1.5)),
        }).start();

    }, [step, flow]);

    const animatedStyle = {
        opacity: stepAnim,
        transform: [{scale: stepAnim.interpolate({inputRange: [0, 1], outputRange: [0.95, 1]})}],
    };

    // --- LOGIC HANDLERS ---

    const handleForgotPassword = () => {
        setFlow('recovery');
        setStep('forgot-password');
    };

    const handleSendRecoveryCode = async () => {
        if (!phoneNumber) {
            setLocalError("Please enter your phone number");
            return;
        }
        setLocalLoading(true);
        try {
            await authService.requestOtp({
                phoneNumber: phoneNumber,
                mode: "password"
            });
            setSuccessMessage("Recovery code sent!");
            setStep('otp');
        } catch (e: any) {
            setLocalError(e.message || "Failed to send code");
        } finally {
            setLocalLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otpCode || otpCode.length < 6) {
            setLocalError("Please enter a valid verification code.");
            return;
        }

        try {
            if (flow === 'auth') {
                await completeRegistration(otpCode);
                setSuccessMessage("Account verified! Redirecting...");
                router.replace("/(protected)/(shop)");
            } else {
                setLocalLoading(true);

                const response = await authService.verifyOtp({
                    phoneNumber: phoneNumber,
                    otp: otpCode,
                    mode: "password"
                });

                setRecoveryToken(response.verificationToken);
                setLocalLoading(false);
                setStep('reset-password');
            }
        } catch (e) {
            console.log("OTP Verification failed");
        }
    };

    const handleResetPassword = async () => {
        if (!password || !confirmPassword) {
            setLocalError("Please fill in all fields");
            return;
        }
        if (password !== confirmPassword) {
            setLocalError("Passwords do not match");
            return;
        }
        if (!recoveryToken) {
            setLocalError("Session expired. Please try again.");
            setStep('forgot-password');
            return;
        }

        setLocalLoading(true);
        try {
            await authService.resetPassword({
                confirmPassword: confirmPassword,
                newPassword: password,
                verificationToken: recoveryToken
            });

            setSuccessMessage("Password reset successfully! Please login.");

            setTimeout(() => {
                setFlow('auth');
                setStep('login');
                setPass("");
                setConfirmPassword("");
                setOtpCode("");
                setRecoveryToken(null);
                setSuccessMessage(null);
            }, 1500);

        } catch (e: any) {
            setLocalError(e.response?.data?.message || "Failed to reset password");
        } finally {
            setLocalLoading(false);
        }
    };

    const handleLoginOrSignup = async () => {
        setLocalError(null);
        setSuccessMessage(null);
        Keyboard.dismiss();

        try {
            if (step === 'login') {
                setLocalLoading(true);
                if (mode === 'email') await login(email, password);
                else await login(phoneNumber, password);
                router.replace("/(protected)/(shop)");
            } else if (step === 'signup') {
                if (!name || !username || !email || !phoneNumber || !password) {
                    throw new Error("Please fill in all required fields.");
                }
                setFlow('auth');
                console.log("request otp")
                await requestSignupOtp({name, username, email, phoneNumber, password, mode});
                setSuccessMessage("Code sent! Please check your device.");
                setStep('otp');
            }
        } catch (err: any) {
            setLocalError(err.message || "Authentication failed");
        } finally {
            setLocalLoading(false);
        }
    };

    const handleGoogleSignIn = async (token: string) => {
        try {
            console.log("start google login")
            await continueWithGoogle({idToken:token});
            router.replace("/(protected)/(shop)");
        } catch (e) {
            console.log("Google flow failed in component");
        }
    };

    // Helper: Back Button Logic
    const handleBack = () => {
        if (step === 'otp') {
            // If in recovery, go back to phone input. If auth, go back to signup.
            setStep(flow === 'recovery' ? 'forgot-password' : 'signup');
        } else if (step === 'forgot-password' || step === 'reset-password') {
            setFlow('auth');
            setStep('login');
        } else {
            setStep('login');
        }
    };

    // Helper: Header Texts
    const getHeaderText = () => {
        if (step === 'forgot-password') return {
            title: "Forgot Password?",
            sub: "Enter your phone number to receive a recovery code."
        };
        if (step === 'reset-password') return {
            title: "Reset Password",
            sub: "Create a new strong password for your account."
        };
        if (step === 'otp') return {
            title: "Verification",
            sub: `Enter code sent to ${flow === 'recovery' || mode === 'phone' ? phoneNumber : email}`
        };
        if (step === 'signup') return {title: "Create Account", sub: "Fill in the details below to join us"};
        return {title: "Welcome Back", sub: "Enter your credentials to access your account"};
    };

    const headerContent = getHeaderText();

    return (
        <ScreenWrapper contentContainerStyle={styles.screenScrollContainer}>
            <VerifyingOverlay visible={isVerifying} />
            <View style={styles.contentContainer}>
                {/* --- HEADER --- */}
                <View style={styles.header}>
                    <View style={styles.logoBadge}>
                        <Sparkles size={32} color={theme.colors.gray900}/>
                    </View>
                    <Text style={styles.title}>{headerContent.title}</Text>
                    <Text style={styles.subtitle}>{headerContent.sub}</Text>
                </View>

                <AlertBlock message={displayError} type="error" onDismiss={() => {
                    setLocalError(null);
                    setAuthError(null)
                }}/>
                <AlertBlock message={successMessage} type="success" onDismiss={() => setSuccessMessage(null)}/>

                {/* --- MAIN FORM --- */}
                <Animated.View style={[styles.formContainer, animatedStyle]}>

                    {/* 1. LOGIN / SIGNUP TABS */}
                    {step === 'login' && (
                        <SlidingTabs tabs={['email', 'phone']} activeTab={mode}
                                     onTabChange={(t) => setMode(t as AuthMode)}/>
                    )}

                    {/* 2. SIGNUP INPUTS */}
                    {step === "signup" && (
                        <>
                            <CustomInput icon={User} placeholder="Full name" value={name} onChangeText={setName}/>
                            <CustomInput icon={AtSign} placeholder="Username" value={username}
                                         onChangeText={setUsername} autoCapitalize="none"/>
                            <CustomInput icon={Mail} placeholder="Email address" value={email} onChangeText={setEmail}
                                         keyboardType="email-address"/>
                            <CustomInput prefixText="+95" placeholder="9 XXX XXX XXX" value={phoneNumber}
                                         onChangeText={(t: string) => setPhone(t.replace(/\D/g, ""))}
                                         keyboardType="phone-pad"/>
                        </>
                    )}

                    {/* 3. LOGIN INPUTS */}
                    {step === "login" && (
                        mode === "email" ? (
                            <CustomInput icon={Mail} placeholder="Email address" value={email} onChangeText={setEmail}
                                         keyboardType="email-address"/>
                        ) : (
                            <CustomInput prefixText="+95" placeholder="9 XXX XXX XXX" value={phoneNumber}
                                         onChangeText={(t: string) => setPhone(t.replace(/\D/g, ""))}
                                         keyboardType="phone-pad"/>
                        )
                    )}

                    {/* 4. FORGOT PASSWORD INPUT (Phone Only) */}
                    {step === 'forgot-password' && (
                        <CustomInput
                            prefixText="+95"
                            placeholder="9 XXX XXX XXX"
                            value={phoneNumber}
                            onChangeText={(t: string) => setPhone(t.replace(/\D/g, ""))}
                            keyboardType="phone-pad"
                            autoFocus
                        />
                    )}

                    {/* 5. PASSWORD FIELDS (Login / Signup) */}
                    {(step === 'login' || step === 'signup') && (
                        <CustomInput
                            icon={Lock} placeholder="Password" value={password} onChangeText={setPass}
                            secureTextEntry={!isPasswordVisible} rightIcon={isPasswordVisible ? EyeOff : Eye}
                            onRightIconPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        />
                    )}

                    {/* 6. RESET PASSWORD FIELDS (New Pass + Confirm) */}
                    {step === 'reset-password' && (
                        <>
                            <CustomInput
                                icon={Lock} placeholder="New Password" value={password} onChangeText={setPass}
                                secureTextEntry={!isPasswordVisible} rightIcon={isPasswordVisible ? EyeOff : Eye}
                                onRightIconPress={() => setIsPasswordVisible(!isPasswordVisible)}
                            />
                            <CustomInput
                                icon={Lock} placeholder="Confirm Password" value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={true}
                            />
                        </>
                    )}

                    {/* Forgot Password Link */}
                    {step === 'login' && (
                        <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordButton}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    )}

                    {/* 7. OTP INPUT (Reused for Signup & Recovery) */}
                    {step === 'otp' && (
                        <View style={styles.otpContainer}>
                            <CustomInput
                                icon={KeyRound} placeholder="Enter 6-digit Code" value={otpCode}
                                onChangeText={setOtpCode} keyboardType="number-pad" maxLength={6} autoFocus
                            />
                            <TouchableOpacity style={styles.resendButton}>
                                <Text style={styles.resendText}>Didn&#39;t receive code? Resend</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* --- MAIN ACTION BUTTON --- */}
                    <CustomButton
                        onPress={
                            step === 'otp' ? handleVerifyOtp :
                                step === 'forgot-password' ? handleSendRecoveryCode :
                                    step === 'reset-password' ? handleResetPassword :
                                        handleLoginOrSignup
                        }
                        disabled={isLoading}
                        style={styles.primaryButton}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={theme.colors.white}/>
                        ) : (
                            step === "signup" ? "Create Account" :
                                step === 'otp' ? "Verify Code" :
                                    step === 'forgot-password' ? "Send Recovery Code" :
                                        step === 'reset-password' ? "Reset Password" :
                                            "Sign In"
                        )}
                    </CustomButton>

                    {/* --- BACK NAVIGATION --- */}
                    {(step !== 'login') && (
                        <TouchableOpacity onPress={handleBack} style={styles.linkButtonBack}>
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                                <ArrowLeft size={16} color={theme.colors.gray500}/>
                                <Text style={styles.linkText}>
                                    {step === 'otp' ? "Back" : "Back to login"}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </Animated.View>

                {/* --- FOOTER (Only on Login/Signup) --- */}
                {(step === 'login' || step === 'signup') && (
                    <View style={styles.footerContainer}>
                        <View style={styles.divider}>
                            <View style={styles.dividerLine}/><Text style={styles.dividerText}>OR</Text><View
                            style={styles.dividerLine}/>
                        </View>

                        <CustomButton variant="social" onPress={() => promptAsync()} disabled={isLoading || !request}>
                            <FontAwesome name={"google"} size={20} color={"black"} style={styles.googleIcon}/>
                            <Text style={styles.buttonTextSocial}>Continue with Google</Text>
                        </CustomButton>

                        <TouchableOpacity onPress={() => setStep(prev => prev === "login" ? "signup" : "login")}
                                          style={styles.linkButton}>
                            <Text style={styles.linkText}>
                                {step === 'login' ? "Don't have an account? " : "Already have an account? "}
                                <Text style={styles.linkTextPrimary}>{step === 'login' ? "Sign up" : "Sign in"}</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    screenScrollContainer: {flexGrow: 1, justifyContent: 'center', paddingVertical: 20},
    contentContainer: {width: '100%', maxWidth: 500, alignSelf: 'center', paddingHorizontal: theme.spacing.xl},
    header: {alignItems: "center", marginBottom: 30},
    logoBadge: {
        width: 64,
        height: 64,
        borderRadius: 18,
        backgroundColor: theme.colors.primary,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: theme.spacing.md
    },
    title: {fontSize: 28, fontWeight: "bold", color: theme.colors.gray900, marginBottom: 8},
    subtitle: {fontSize: 14, color: theme.colors.gray500, textAlign: "center", paddingHorizontal: 20},
    formContainer: {width: "100%", marginBottom: 20, alignItems: 'center'},
    otpContainer: {width: '100%', alignItems: 'center', marginBottom: 10},
    forgotPasswordButton: {alignSelf: 'flex-end', marginBottom: 20, marginTop: -5},
    forgotPasswordText: {color: theme.colors.primary, fontSize: 14, fontWeight: '600', textDecorationLine: 'underline'},
    resendButton: {marginTop: 8, marginBottom: 8, alignSelf: 'flex-end'},
    resendText: {fontSize: 12, color: theme.colors.primary, fontWeight: '600'},
    primaryButton: {marginTop: 0, width: '100%'},
    footerContainer: {width: '100%'},
    divider: {flexDirection: "row", alignItems: "center", marginBottom: 20},
    dividerLine: {flex: 1, height: 1, backgroundColor: theme.colors.gray300},
    dividerText: {paddingHorizontal: 10, fontSize: 12, color: theme.colors.gray500, fontWeight: '600'},
    buttonTextSocial: {color: theme.colors.gray900, fontWeight: '500'},
    googleIcon: {marginRight: 10},
    linkButton: {padding: 10, alignItems: 'center'},
    linkButtonBack: {padding: 10, marginTop: 10, alignItems: 'center'},
    linkText: {fontSize: 14, color: theme.colors.gray500},
    linkTextPrimary: {color: theme.colors.primary, fontWeight: "600"},
});