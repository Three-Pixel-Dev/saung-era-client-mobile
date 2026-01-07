import { View, Text, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { theme } from "@/app/src/theme";

export const VerifyingOverlay = ({ visible }: { visible: boolean }) => (
    <Modal transparent visible={visible} animationType="fade">
        <View style={styles.overlay}>
            <View style={styles.card}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.text}>Verifying Account...</Text>
                <Text style={styles.subtext}>Please wait while we sync with Google</Text>
            </View>
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        width: '80%',
    },
    text: { marginTop: 15, fontSize: 18, fontWeight: 'bold', color: theme.colors.gray900 },
    subtext: { marginTop: 5, fontSize: 14, color: theme.colors.gray500 }
});