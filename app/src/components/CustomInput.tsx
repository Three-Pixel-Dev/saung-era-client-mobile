/*
|--------------------------------------------------------------------------
| CustomInput Component
|--------------------------------------------------------------------------
| A reusable text input component with optional icon and prefix text.
|
| Features:
| - Supports leading icons (e.g. email, lock icons)
| - Supports static prefix text (e.g. country code, currency)
| - Consistent styling across the app
| - Works with all standard TextInput props
|
| Behavior:
| - Adjusts padding automatically when icon or prefix is present
| - Uses theme colors and spacing for consistency
| - Disables auto-capitalization by default
|
| Props:
| - icon: Optional icon component rendered on the left
| - placeholder: Input placeholder text
| - value: Controlled input value
| - onChangeText: Change handler
| - keyboardType: Keyboard type (email, number, etc.)
| - secureTextEntry: Enables password-style input
| - prefixText: Optional static text shown before the input value
|
| Usage:
| - Use for forms (login, signup, profile, etc.)
|--------------------------------------------------------------------------
*/
import {StyleSheet, TextInput, Text, View} from "react-native";
import {theme} from "@/app/src/theme";

export const CustomInput: React.FC<any> = ({ icon: Icon, placeholder, value, onChangeText, keyboardType, secureTextEntry, prefixText }) => (
    <View style={styles.inputContainer}>
    {Icon && <Icon style={styles.inputIcon} size={20} color={theme.colors.gray500} />}
    {prefixText && <Text style={styles.inputPrefix}>{prefixText}</Text>}
    <TextInput
    style={[styles.input, Icon && styles.inputWithIcon, prefixText && styles.inputWithPrefix]}
    placeholder={placeholder}
    placeholderTextColor={theme.colors.gray500}
    value={value}
    onChangeText={onChangeText}
    keyboardType={keyboardType}
    autoCapitalize="none"
    secureTextEntry={secureTextEntry}
    />
    </View>
);

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: theme.colors.gray300,
        borderRadius: 10,
        marginBottom: theme.spacing.md,
        height: theme.constant.inputHeight,
        backgroundColor: theme.colors.white,
    },

    inputIcon: {
        marginLeft: 15,
    },
    inputPrefix: {
        marginLeft: 15,
        fontSize: 16,
        color: theme.colors.gray900,
        fontWeight: '600',
    },
    input: {
        flex: 1,
        height: "100%",
        paddingHorizontal: theme.spacing.md,
        color: theme.colors.gray900,
        fontSize: 16,
    },
    inputWithIcon: {
        paddingLeft: 10,
    },
    inputWithPrefix: {
        paddingLeft: 5,
    },
});