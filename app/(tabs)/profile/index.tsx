import { User } from "@/@types/user";
import PageLayout from "@/components/page-layout";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "@/components/ui/svg-icons/chevron-right-icon";
import { Typography } from "@/components/ui/typography";
import { useSession } from "@/context/session-context";
import { useAppSelector } from "@/hooks/use-redux-toolkit";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { useTranslation } from "@/hooks/use-translation";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Pressable, View, type ViewStyle } from "react-native";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { signOut } = useSession();
  const user = useAppSelector((state) => state.auth.user) as User | null;

  const { styles, colors } = useThemedStyles((colors) => ({
    container: {
      flex: 1,
      padding: 16,
    } as ViewStyle,
    header: {
      marginBottom: 32,
    } as ViewStyle,
    title: {
      marginBottom: 24,
    },
    profileSection: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 32,
    } as ViewStyle,
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: 16,
      backgroundColor: colors.border,
    },
    profileInfo: {
      flex: 1,
    } as ViewStyle,
    userName: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
      color: colors.tabIconDefault,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    } as ViewStyle,
    menuItemLast: {
      borderBottomWidth: 0,
    } as ViewStyle,
    menuItemContent: {
      flex: 1,
    } as ViewStyle,
    menuItemTitle: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 4,
    },
    menuItemSubtitle: {
      fontSize: 14,
      color: colors.tabIconDefault,
    },
    logoutButton: {
      marginTop: 32,
    } as ViewStyle,
  }));

  const handleLogout = () => {
    signOut();
  };

  const handleLanguagePress = () => {
    router.push("/profile/language");
  };

  const fullName = user ? `${user.firstName} ${user.lastName}` : "User";
  const email = user?.email || "";

  return (
    <PageLayout shouldShowSafeArea={true} scrollable={false}>
      <ThemedView style={styles.container} scrollable={false}>
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h1" style={styles.title}>
            {t("profile.myProfile")}
          </Typography>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <Image
              source={
                user?.image
                  ? { uri: user.image }
                  : require("@/assets/images/icon.png")
              }
              style={styles.profileImage}
              contentFit="cover"
            />
            <View style={styles.profileInfo}>
              <Typography variant="body" weight="700" style={styles.userName}>
                {fullName}
              </Typography>
              <Typography variant="bodySmall" style={styles.userEmail}>
                {email}
              </Typography>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <Pressable
          style={styles.menuItem}
          onPress={handleLanguagePress}
          accessibilityRole="button"
          accessibilityLabel={t("profile.language")}
          accessibilityHint={t("profile.languageSubtitle")}
        >
          <View style={styles.menuItemContent}>
            <Typography variant="body" style={styles.menuItemTitle}>
              {t("profile.language")}
            </Typography>
            <Typography variant="bodySmall" style={styles.menuItemSubtitle}>
              {t("profile.languageSubtitle")}
            </Typography>
          </View>
          <ChevronRightIcon fill={colors.tabIconDefault} />
        </Pressable>

        {/* Logout Button */}
        <Button
          title={t("profile.logout")}
          onPress={handleLogout}
          buttonStyle={styles.logoutButton}
          accessibilityLabel={t("profile.logout")}
          accessibilityHint={t("profile.logoutHint")}
        />
      </ThemedView>
    </PageLayout>
  );
}
