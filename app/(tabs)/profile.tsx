import PageLayout from "@/components/page-layout";
import { ThemedView } from "@/components/themed-view";
import { Typography } from "@/components/ui/typography";
import { useSession } from "@/context/session-context";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import React from "react";
import { Pressable, View, type ViewStyle } from "react-native";

export default function ProfileScreen() {
  const { signOut, session } = useSession();

  const { styles, colors } = useThemedStyles((colors) => ({
    container: {
      flex: 1,
      padding: 24,
    } as ViewStyle,
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    } as ViewStyle,
    button: {
      marginTop: 24,
      paddingHorizontal: 24,
      paddingVertical: 12,
      backgroundColor: colors.tint,
      borderRadius: 8,
    } as ViewStyle,
  }));

  const handleLogout = () => {
    // The guard in RootNavigator will redirect back to the login screen
    signOut();
  };

  return (
    <PageLayout shouldShowSafeArea={true}>
      <ThemedView style={styles.container} scrollable={false}>
        <View style={styles.content}>
          <Typography variant="h1" color="text" align="center">
            Profile
          </Typography>
          {session && (
            <Pressable style={styles.button} onPress={handleLogout}>
              <Typography variant="button" customColor={colors.background}>
                Logout
              </Typography>
            </Pressable>
          )}
        </View>
      </ThemedView>
    </PageLayout>
  );
}
