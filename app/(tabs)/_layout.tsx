import { Redirect, Tabs } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Platform, Text, View, type ViewStyle } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { BagIcon } from "@/components/ui/svg-icons/bag-icon";
import { HeartIcon } from "@/components/ui/svg-icons/heart-icon";
import { HomeIcon } from "@/components/ui/svg-icons/home-icon";
import { ProfileIcon } from "@/components/ui/svg-icons/profile-icon";
import { ShopIcon } from "@/components/ui/svg-icons/shop-icon";
import { useSession } from "@/context/session-context";
import { useAppSelector } from "@/hooks/use-redux-toolkit";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { selectCart } from "@/redux/cart/cart-slice";
import { selectFavorites } from "@/redux/favorites/favorites-slice";

export default function TabLayout() {
  const { t } = useTranslation();
  const { session, isLoading } = useSession();
  const cart = useAppSelector(selectCart);
  const cartItemCount = cart?.totalQuantity || 0;
  const favorites = useAppSelector(selectFavorites);
  const favoritesCount = favorites.length;
  const { styles, colors } = useThemedStyles((colors) => ({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    tabBarStyle: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 10,
      height: Platform.OS === "ios" ? 88 : 70,
      position: "absolute",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: colors.border,
      // Shadow for top of tab bar (appears above) - theme-aware
      ...(Platform.OS === "ios"
        ? {
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: colors.background === "#151718" ? 0.5 : 0.15,
            shadowRadius: 8,
          }
        : {
            elevation: 12,
          }),
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: "500",
      marginTop: 4,
    },
    tabBarItemStyle: {
      paddingVertical: 4,
    },
    badgeContainer: {
      position: "absolute",
      top: -4,
      right: -8,
      backgroundColor: "#DB3022", // Red color for badge
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 6,
      borderWidth: 2,
      borderColor: colors.background, // Match tab bar background
    } as ViewStyle,
    badgeText: {
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: "700",
      textAlign: "center",
    },
    iconContainer: {
      position: "relative",
    } as ViewStyle,
  }));

  // Show nothing while loading to prevent flicker
  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: styles.tabBarStyle,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarItemStyle: styles.tabBarItemStyle,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color, focused }) => (
            <HomeIcon
              fill={focused ? color : "#fff"}
              stroke={focused ? undefined : "#9B9B9B"}
            />
          ),
          tabBarAccessibilityLabel: t("tabs.home"),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: t("tabs.shop"),
          tabBarIcon: ({ color, focused }) => (
            <ShopIcon
              fill={focused ? color : "#fff"}
              stroke={focused ? undefined : "#9B9B9B"}
            />
          ),
          tabBarAccessibilityLabel: t("tabs.shop"),
        }}
      />
      <Tabs.Screen
        name="bag"
        options={{
          title: t("tabs.bag"),
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <BagIcon fill={focused ? color : "#fff"} stroke={color} />
              {cartItemCount > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </Text>
                </View>
              )}
            </View>
          ),
          tabBarAccessibilityLabel:
            cartItemCount > 0
              ? `${t("tabs.bag")}, ${cartItemCount} ${t("bag.items", {
                  count: cartItemCount,
                })}`
              : t("tabs.bag"),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t("tabs.favorites"),
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <HeartIcon fill={focused ? color : "#fff"} stroke={color} />
              {favoritesCount > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>
                    {favoritesCount > 99 ? "99+" : favoritesCount}
                  </Text>
                </View>
              )}
            </View>
          ),
          tabBarAccessibilityLabel:
            favoritesCount > 0
              ? `${t("tabs.favorites")}, ${t("favorites.items", {
                  count: favoritesCount,
                })}`
              : t("tabs.favorites"),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
          tabBarIcon: ({ color, focused }) => (
            <ProfileIcon
              fill={focused ? color : "#fff"}
              stroke={focused ? undefined : "#9B9B9B"}
            />
          ),
          tabBarAccessibilityLabel: t("tabs.profile"),
        }}
      />
    </Tabs>
  );
}
