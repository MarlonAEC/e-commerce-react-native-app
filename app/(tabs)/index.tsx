import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>{t("home.title")}</ThemedText>
      <ThemedText style={styles.greeting}>{t("home.greeting")}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  greeting: {
    fontSize: 16,
  },
});
