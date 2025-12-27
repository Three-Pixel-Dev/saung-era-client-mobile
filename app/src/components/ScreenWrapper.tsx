/*
|--------------------------------------------------------------------------
| ScreenWrapper Component
|--------------------------------------------------------------------------
| A reusable layout wrapper for screens across the app.
|
| Responsibilities:
| - Handles Safe Area insets (top & bottom) for modern devices
| - Automatically dismisses the keyboard when tapping outside inputs
| - Adjusts layout when the keyboard appears (iOS & Android support)
| - Provides a scrollable container with consistent padding
|
| When to use:
| - Wrap any screen that contains forms or inputs
| - Use when vertical scrolling is required
| - Use for consistent screen spacing and background styling
|
| Props:
| - children: Screen content
| - style: Optional style override for the SafeAreaView
| - contentContainerStyle: Optional style override for ScrollView content
|--------------------------------------------------------------------------
*/
import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet,
    ViewStyle
} from 'react-native';
import { theme } from "@/app/src/theme";
import { SafeAreaView } from "react-native-safe-area-context";
interface ScreenWrapperProps {
    children: React.ReactNode;
    style?: ViewStyle;
    contentContainerStyle?: ViewStyle;
}

export const ScreenWrapper = ({ children, style, contentContainerStyle }: ScreenWrapperProps) => {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={[styles.safeArea, style]} edges={["top", "bottom"]}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
                >
                    <ScrollView
                        contentContainerStyle={[styles.scrollContainer, contentContainerStyle]}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {children}
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingVertical: 20,
    },
});