import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Product } from "../../domain/products/product.types";
import { theme } from "../../theme";

export default function ProductCard({ product }: { product: Product }) {
    return (
        <TouchableOpacity style={styles.card}>
            <Image source={{ uri: product.image }} style={styles.image} />

            <Text style={styles.title}>{product.name}</Text>

            <Text style={styles.price}>${product.price}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: theme.spacing.md,
        backgroundColor: theme.colors.white,
        borderRadius: 12,
        marginBottom: theme.spacing.md,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: "100%",
        height: 160,
        borderRadius: 8,
        marginBottom: theme.spacing.sm,
    },
    title: {
        color: theme.colors.gray900,
    },
    price: {
        marginTop: theme.spacing.xs,
        color: theme.colors.gray500,
    },
});
