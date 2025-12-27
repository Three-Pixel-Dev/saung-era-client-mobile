/*
|--------------------------------------------------------------------------
| SlidingTabs Component
|--------------------------------------------------------------------------
| A horizontal tab switcher with an animated sliding indicator.
|
| Features:
| - Displays a list of tabs with equal width
| - Animates an active background slider when the tab changes
| - Controlled component (active tab is managed by parent)
| - Smooth transition using React Native Animated API
|
| How it works:
| - Measures container width on layout to calculate tab size
| - Uses an Animated.Value to interpolate the slider's X position
| - Active tab is determined by matching `activeTab` to `tabs`
|
| Props:
| - tabs: Array of tab labels
| - activeTab: Currently selected tab
| - onTabChange: Callback fired when a tab is pressed
|
| Usage:
| - Ideal for toggling between two or more views (e.g. Login / Signup)
| - Works best with a small, fixed number of tabs
|--------------------------------------------------------------------------
*/
import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated, Text, StyleSheet, Easing } from 'react-native';
import { theme } from "@/app/src/theme";

interface SlidingTabsProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const SlidingTabs = ({ tabs, activeTab, onTabChange }: SlidingTabsProps) => {
    const [containerWidth, setContainerWidth] = useState(0);
    const tabAnim = useRef(new Animated.Value(0)).current;

    // Determine index: 0 or 1
    const activeIndex = tabs.indexOf(activeTab);

    useEffect(() => {
        Animated.timing(tabAnim, {
            toValue: activeIndex,
            duration: 250,
            useNativeDriver: false,
            easing: Easing.inOut(Easing.ease),
        }).start();
    }, [activeIndex]);

    const sliderWidth = containerWidth > 0 ? (containerWidth - 4) / tabs.length : 0;

    const translateX = tabAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, sliderWidth],
    });

    return (
        <View
            style={styles.tabContainer}
            onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        >
            {sliderWidth > 0 && (
                <Animated.View
                    style={[
                        styles.activeSlider,
                        { width: sliderWidth, transform: [{ translateX }] }
                    ]}
                />
            )}

            {tabs.map((tab, index) => {
                const isSelected = activeTab === tab;

                const textColor = isSelected ? theme.colors.white : theme.colors.gray500;

                return (
                    <TouchableOpacity
                        key={tab}
                        style={styles.tab}
                        onPress={() => onTabChange(tab)}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.tabText, { color: textColor }]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.gray200,
        padding: 2,
        borderRadius: 10,
        marginBottom: 20,
        height: 50,
        width: '100%',
    },
    activeSlider: {
        position: 'absolute',
        top: 2,
        left: 2,
        bottom: 2,
        backgroundColor: theme.colors.primary,
        borderRadius: 8,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
    },
});