import { useEffect, useState } from "react";
import { ScrollView, Text, Button } from "react-native";
import { useAuth } from "@/app/src/context/AuthContext";
import ProductCard from "@/app/src/components/product/ProductCard";
import { mockFetchProducts} from "@/app/src/services/mockapi";
import { theme } from "@/app/src/theme";

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

    return (
        <ScrollView
            style={{
                flex: 1,
                padding: theme.spacing.md,
                backgroundColor: theme.colors.background,
            }}
        >
            <Text>Welcome, {user?.firstName ?? "User"}!</Text>
            <Button title="Sign Out!" onPress={() => logout()} />
            {loading && <Text>Loading...</Text>}
            {!loading &&
                products.map((p) => <ProductCard key={p.id} product={p} />)}
        </ScrollView>
    );
}
