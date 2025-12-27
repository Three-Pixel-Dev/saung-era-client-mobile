/*
|--------------------------------------------------------------------------
| CustomButton Component
|--------------------------------------------------------------------------
| A reusable button component with built-in press throttling.
|
| Features:
| - Prevents rapid multiple presses using a configurable throttle
| - Supports multiple visual variants (default, social)
| - Handles disabled state with visual feedback
| - Accepts text or custom React nodes as children
|
| Behavior:
| - Throttling ensures `onPress` is not triggered repeatedly
| - Disabled buttons ignore press events
| - Styling adapts based on the selected variant
|
| Props:
| - children: Button label or custom content
| - onPress: Callback executed on button press
| - disabled: Disables interaction and reduces opacity
| - variant: Visual style ("default" | "social")
| - style: Optional style override
| - throttleTime: Minimum time (ms) between presses
|
| Usage:
| - Use for primary actions to avoid double submissions
| - Ideal for form submits and social login buttons
|--------------------------------------------------------------------------
*/
import React, { useRef } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    ViewStyle,
    StyleProp,
} from "react-native";
import { theme } from "@/app/src/theme";

interface CustomButtonProps {
    children: React.ReactNode;
    onPress: () => void;
    disabled?: boolean;
    variant?: "default" | "social";
    style?: StyleProp<ViewStyle>;
    throttleTime?: number;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
                                                              children,
                                                              onPress,
                                                              disabled,
                                                              variant = "default",
                                                              style,
                                                              throttleTime = 500
                                                          }) => {
    const lastTap = useRef<number>(0);

    const handlePress = () => {
        const now = Date.now();
        if (throttleTime > 0 && (now - lastTap.current) < throttleTime) {
            return;
        }
        lastTap.current = now;
        onPress();
    };

    const isDefault = variant === "default";
    const isSocial = variant === "social";

    const baseStyle = [
        styles.buttonBase,
        isDefault && styles.buttonDefault,
        isSocial && styles.buttonSocial,
        disabled && styles.buttonDisabled,
        style,
    ];

    const textStyle = [
        styles.buttonText,
        isDefault && styles.buttonTextDefault,
        isSocial && styles.buttonTextSocial
    ];

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={disabled}
            style={baseStyle as StyleProp<ViewStyle>}
            activeOpacity={0.7}
        >
            {typeof children === "string" ? (
                <Text style={textStyle}>{children}</Text>
            ) : (
                children
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonBase: {
        height: theme.constant.inputHeight,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    buttonDefault: {
        backgroundColor: theme.colors.primary,
    },
    buttonSocial: {
        backgroundColor: theme.colors.white,
        borderColor: theme.colors.gray300,
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
    }
});