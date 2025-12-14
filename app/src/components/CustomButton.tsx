import {StyleSheet} from "react-native";
import {theme} from "@/app/src/theme";
import {TouchableOpacity,Text} from "react-native";
export const CustomButton: React.FC<any> = ({ children, onPress, disabled, variant = "default", style }) => {
    const isDefault = variant === "default";
    const isSocial = variant === "social";
    const baseStyle = [
        styles.buttonBase,
        isDefault && styles.buttonDefault,
        isSocial && styles.buttonSocial,
        disabled && styles.buttonDisabled,
        style,
    ];
    const textStyle = [styles.buttonText, isDefault && styles.buttonTextDefault];

    return (
        <TouchableOpacity onPress={onPress} disabled={disabled} style={baseStyle} activeOpacity={0.7}>
            {typeof children === "string" ? <Text style={textStyle}>{children}</Text> : children}
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