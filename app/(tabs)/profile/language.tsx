import PageLayout from "@/components/page-layout";
import { ThemedView } from "@/components/themed-view";
import { ChevronLeftIcon } from "@/components/ui/svg-icons/chevron-left-icon";
import { Typography } from "@/components/ui/typography";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { useTranslation } from "@/hooks/use-translation";
import i18n from "@/i18n";
import { router } from "expo-router";
import React from "react";
import { Pressable, View, type ViewStyle } from "react-native";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
];

export default function LanguageScreen() {
  const { t, i18n: i18nInstance } = useTranslation();
  const currentLanguage = i18nInstance.language || "en";

  const { styles, colors } = useThemedStyles((colors) => ({
    container: {
      flex: 1,
      padding: 16,
    } as ViewStyle,
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
    } as ViewStyle,
    backButton: {
      padding: 8,
      marginRight: 12,
    } as ViewStyle,
    headerTitle: {
      flex: 1,
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
    },
    languageItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    } as ViewStyle,
    languageItemLast: {
      borderBottomWidth: 0,
    } as ViewStyle,
    languageName: {
      fontSize: 16,
      color: colors.text,
    },
    selectedIndicator: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.tint,
      borderWidth: 2,
      borderColor: colors.tint,
    } as ViewStyle,
    unselectedIndicator: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: "transparent",
    } as ViewStyle,
  }));

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode !== currentLanguage) {
      await i18n.changeLanguage(languageCode);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <PageLayout shouldShowSafeArea={true} scrollable={false}>
      <ThemedView style={styles.container} scrollable={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={handleBackPress}
            accessibilityRole="button"
            accessibilityLabel={t("common.back")}
            accessibilityHint="Navigate back to profile"
          >
            <ChevronLeftIcon fill={colors.text} />
          </Pressable>
          <Typography variant="h1" style={styles.headerTitle}>
            {t("profile.language")}
          </Typography>
        </View>

        {/* Language List */}
        {LANGUAGES.map((language, index) => {
          const isSelected = currentLanguage === language.code;
          const isLast = index === LANGUAGES.length - 1;

          return (
            <Pressable
              key={language.code}
              style={[
                styles.languageItem,
                isLast && styles.languageItemLast,
              ]}
              onPress={() => handleLanguageChange(language.code)}
              accessibilityRole="button"
              accessibilityLabel={language.name}
              accessibilityState={{ selected: isSelected }}
              accessibilityHint={
                isSelected
                  ? "Currently selected language"
                  : `Change language to ${language.name}`
              }
            >
              <Typography variant="body" style={styles.languageName}>
                {language.name}
              </Typography>
              <View
                style={
                  isSelected
                    ? styles.selectedIndicator
                    : styles.unselectedIndicator
                }
              />
            </Pressable>
          );
        })}
      </ThemedView>
    </PageLayout>
  );
}

