import { Redirect, Tabs } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { BagIcon } from "@/components/ui/svg-icons/bag-icon";
import { HeartIcon } from "@/components/ui/svg-icons/heart-icon";
import { HomeIcon } from "@/components/ui/svg-icons/home-icon";
import { ProfileIcon } from "@/components/ui/svg-icons/profile-icon";
import { ShopIcon } from "@/components/ui/svg-icons/shop-icon";
import { useSession } from "@/context/session-context";
import { useThemedStyles } from "@/hooks/use-themed-styles";

export default function TabLayout() {
  const { t } = useTranslation();
  const { session, isLoading } = useSession();
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
            <BagIcon fill={focused ? color : "#fff"} stroke={color} />
          ),
          tabBarAccessibilityLabel: t("tabs.bag"),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t("tabs.favorites"),
          tabBarIcon: ({ color, focused }) => (
            <HeartIcon fill={focused ? color : "#fff"} stroke={color} />
          ),
          tabBarAccessibilityLabel: t("tabs.favorites"),
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
