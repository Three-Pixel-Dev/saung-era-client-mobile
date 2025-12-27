/*
|--------------------------------------------------------------------------
| AlertBlock Component
|--------------------------------------------------------------------------
| A lightweight, dismissible alert message component.
|
| Features:
| - Supports "error" and "success" alert types
| - Displays contextual colors and icons based on alert type
| - Can be dismissed via close (X) button
| - Renders nothing when no message is provided
|
| Behavior:
| - Error alerts show red styling and text
| - Success alerts show green styling with a success icon
| - Parent component controls visibility and message content
|
| Props:
| - message: Alert text to display (null hides the alert)
| - type: Alert variant ("error" | "success")
| - onDismiss: Callback when the alert is dismissed
|
| Usage:
| - Use for form validation feedback
| - Use for API success/error messages
|--------------------------------------------------------------------------
*/
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { X, CheckCircle } from "lucide-react-native";
import { theme } from "@/app/src/theme";

interface AlertBlockProps {
    message: string | null;
    type: 'error' | 'success';
    onDismiss: () => void;
}

export const AlertBlock = ({ message, type, onDismiss }: AlertBlockProps) => {
    if (!message) return null;

    const isError = type === 'error';

    // Styles based on type
    const containerStyle = isError ? styles.errorBox : styles.successBox;
    const textStyle = isError ? styles.errorText : styles.successText;
    const iconColor = isError ? theme.colors.error : "#15803d";

    return (
        <View style={containerStyle}>
            <View style={styles.contentRow}>
                {!isError && <CheckCircle size={20} color={iconColor} style={{ marginRight: 8 }} />}
                <Text style={textStyle}>{message}</Text>
            </View>
            <TouchableOpacity onPress={onDismiss}>
                <X size={16} color={iconColor} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
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
        width: '100%'
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
        width: '100%'
    },
    contentRow: {
        flexDirection: 'row',
        alignItems:'center',
        flex: 1
    },
    errorText: {
        color: theme.colors.error,
        fontSize: 13,
        flex: 1,
    },
    successText: {
        color: "#15803d",
        fontSize: 13,
        flex: 1,
        fontWeight: '600',
    },
});