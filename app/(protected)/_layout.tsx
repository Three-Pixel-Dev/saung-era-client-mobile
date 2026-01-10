import { Slot, useRouter, usePathname } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
// You might want to import icons here later, e.g., from Lucide-React or Ionicons

export default function ProtectedLayout() {
    // Auth logic (Commented out for now as per your request)
    // const { isSignedIn } = useAuth();
    // if (!isSignedIn) return <Redirect href="/(auth)/auth-screen" />;

    const router = useRouter();
    const pathname = usePathname();

    return (
        <SafeAreaView style={styles.container}>
            {/* Main Content Area */}
            <View style={styles.content}>
                <Slot />
            </View>

            {/* Shared Navigation Bar */}
            <View style={styles.navbar}>

                {/* Shop Tab */}
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => router.push('/(protected)/(shop)')}
                >
                    <Text style={pathname.includes('(shop)') ? styles.activeText : styles.text}>
                        Shop
                    </Text>
                </TouchableOpacity>

                {/* Order Tab */}
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => router.push('/(protected)/(order)')}
                >
                    <Text style={pathname.includes('(order)') ? styles.activeText : styles.text}>
                        Order
                    </Text>
                </TouchableOpacity>

                {/* Cart Tab */}
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => router.push('/(protected)/(cart)')}
                >
                    <Text style={pathname.includes('(order)') ? styles.activeText : styles.text}>
                        Cart
                    </Text>
                </TouchableOpacity>

                {/* Me Tab */}
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => router.push('/(protected)/(me)')}
                >
                    <Text style={pathname.includes('(order)') ? styles.activeText : styles.text}>
                        Me
                    </Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1, // Takes up all available space above the navbar
    },
    navbar: {
        flexDirection: 'row',
        height: 60,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 10, // Extra padding for iPhone home indicator
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    text: {
        color: '#888',
        fontSize: 12,
    },
    activeText: {
        color: 'blue', // Change to your brand color
        fontSize: 12,
        fontWeight: 'bold',
    },
});