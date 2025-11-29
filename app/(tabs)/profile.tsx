import { ThemedView } from "@/components/themed-view";
import { Typography } from "@/components/ui/typography";
import { StyleSheet } from "react-native";

export default function ProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      <Typography variant="h1">Profile</Typography>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
