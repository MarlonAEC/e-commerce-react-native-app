import { ThemedView } from "@/components/themed-view";
import { Typography } from "@/components/ui/typography";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <ThemedView style={styles.container}>
      <Typography variant="h1">{t("home.title")}</Typography>
      <Typography variant="body">{t("home.greeting")}</Typography>
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
