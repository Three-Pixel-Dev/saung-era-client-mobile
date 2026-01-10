import { useEffect, useState } from "react";
import {
    ScrollView,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Button
} from "react-native";
import { useAuth } from "@/app/src/context/AuthContext";
import ProductCard from "@/app/src/components/product/ProductCard";
import { mockFetchProducts } from "@/app/src/services/mockapi";
import { theme } from "@/app/src/theme";
import { Search, MessageCircle, ShoppingCart } from "lucide-react-native";

export default function HomeScreen() {
    const { user, logout } = useAuth();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            const data = await mockFetchProducts();
            setProducts(data);
            setLoading(false);
        };
        loadProducts();
    }, []);

    const NotificationBadge = () => (
        <View style={styles.badge}>
            <View style={styles.badgeDot} />
        </View>
    );

    return (
        <View style={styles.container}>

            {/* --- CUSTOM HEADER --- */}
            <View style={styles.headerContainer}>
                <Text style={styles.brandText}>Saung Era</Text>

                <View style={styles.searchBar}>
                    <Search size={18} color={theme.colors.gray500} style={styles.searchIcon} />
                    <TextInput
                        placeholder="Search products..."
                        placeholderTextColor={theme.colors.gray500}
                        style={styles.searchInput}
                    />
                </View>

                <View style={styles.actionsContainer}>
                    {/*<TouchableOpacity style={styles.iconButton}>*/}
                    {/*    <MessageCircle size={24} color={theme.colors.gray900} />*/}
                    {/*    <NotificationBadge />*/}
                    {/*</TouchableOpacity>*/}

                    <TouchableOpacity style={styles.iconButton}>
                        <ShoppingCart size={24} color={theme.colors.gray900} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.welcomeSection}>
                    <Text>Welcome, {user?.firstName ?? "User"}!</Text>
                    <Button title="Sign Out!" onPress={() => logout()} />
                </View>

                {loading && <Text>Loading...</Text>}

                <View style={styles.productGrid}>
                    {!loading && products.map((p) => (
                        <View key={p.id} style={styles.productWrapper}>
                            <ProductCard product={p} />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        gap: 12,
    },
    brandText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4db6e8',
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 10,
        height: 36,
    },
    searchIcon: {
        marginRight: 6,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: theme.colors.gray900,
        paddingVertical: 0,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconButton: {
        position: 'relative',
        padding: 2,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 10,
        zIndex: 10,
    },
    badgeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#0ea5e9',
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    scrollView: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        padding: theme.spacing.md,
    },
    welcomeSection: {
        marginBottom: 16,
    },
    productGrid: {
        flexDirection: 'column',
        gap: 16
    },
    productWrapper: {
        marginBottom: 10
    }
});