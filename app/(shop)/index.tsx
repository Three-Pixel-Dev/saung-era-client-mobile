import { View, Text, ScrollView } from "react-native";
import { useEffect } from "react";
import { useProductStore} from "@/app/src/domain/products/product.store";
import ProductCard from "@/app/src/components/product/ProductCard";
import { theme} from "@/app/src/theme";

export default function HomeScreen() {
    const { products, loading, loadProducts } = useProductStore();

    useEffect(() => {
        loadProducts();
    }, []);
    console.log("API URL:", process.env.EXPO_PUBLIC_API_URL);
    return (
        <ScrollView
            style={{
                flex: 1,
                padding: theme.spacing.md,
                backgroundColor: theme.colors.background,
            }}
        >
            <Text
                style={{
                    marginBottom: theme.spacing.md,
                    color: theme.colors.gray900,
                }}
            >
                Products
            </Text>

            {loading && <Text>Loading...</Text>}

            {!loading &&
                products.map((p:any) => <ProductCard key={p.id} product={p} />)}
        </ScrollView>
    );
}