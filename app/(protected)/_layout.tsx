import { Slot, useRouter, Href, useSegments } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Store, ClipboardList, ShoppingBag, User } from 'lucide-react-native';
import { theme } from "@/app/src/theme";

export default function ProtectedLayout() {
    const router = useRouter();
    const segments = useSegments() as string[];

    const tabs = [
        {
            name: 'Shop',
            route: '/(protected)/(shop)',
            group: '(shop)',
            icon: Store,
        },
        {
            name: 'Orders',
            route: '/(protected)/(order)',
            group: '(order)',
            icon: ClipboardList,
        },
        {
            name: 'Cart',
            route: '/(protected)/(cart)',
            group: '(cart)',
            icon: ShoppingBag,
        },
        {
            name: 'Me',
            route: '/(protected)/(me)',
            group: '(me)',
            icon: User,
        },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.content}>
                <Slot />
            </View>

            <View style={styles.navbar}>
                {tabs.map((tab) => {
                    const isActive = segments.includes(tab.group);

                    const IconComponent = tab.icon;
                    const activeColor = theme.colors.primary;
                    const inactiveColor = theme.colors.gray500;

                    return (
                        <TouchableOpacity
                            key={tab.name}
                            style={styles.navItem}
                            onPress={() => router.push(tab.route as Href)}
                            activeOpacity={0.7}
                        >
                            <IconComponent
                                size={24}
                                color={isActive ? activeColor : inactiveColor}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <Text style={[
                                styles.text,
                                {
                                    color: isActive ? activeColor : inactiveColor,
                                    fontWeight: isActive ? '600' : '400'
                                }
                            ]}>
                                {tab.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#fff' }} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    content: {
        flex: 1,
    },
    navbar: {
        flexDirection: 'row',
        height: 65,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: theme.colors.gray200 || '#eee',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 5,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 50,
    },
    text: {
        fontSize: 12,
        marginTop: 4,
    },
});