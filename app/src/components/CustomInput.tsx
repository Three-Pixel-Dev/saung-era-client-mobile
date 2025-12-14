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