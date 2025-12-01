import PageLayout from "@/components/page-layout";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/custom-input";
import { Typography } from "@/components/ui/typography";
import { useSession } from "@/context/session-context";
import { useAppDispatch } from "@/hooks/use-redux-toolkit";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { setLoginResponse } from "@/redux/auth/auth-slice";
import { logger } from "@/services/logger";
import { useLoginMutation } from "@/services/store-api/auth";
import { setAccessToken, setRefreshToken } from "@/utils/secure-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View, type ViewStyle } from "react-native";

export default function LoginScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false);

  // Test credentials for dummyjson.com API
  const TEST_CREDENTIALS = {
    username: "emilys",
    password: "emilyspass",
  };

  const fillTestCredentials = () => {
    setUsername(TEST_CREDENTIALS.username);
    setPassword(TEST_CREDENTIALS.password);
  };
  const { session } = useSession();
  const routerNavigation = useRouter();

  // Use RTK Query login mutation
  const [login, { isLoading, error: loginError }] = useLoginMutation();

  const { styles, colors } = useThemedStyles((colors) => ({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    formContainer: {
      width: "100%",
      maxWidth: 400,
    },
    title: {
      marginBottom: 32,
      textAlign: "center",
    },
    input: {
      width: "100%",
      height: 50,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 16,
      marginBottom: 16,
      backgroundColor: colors.background,
      color: colors.text,
      fontSize: 16,
      boxShadow: "0 1 8px 0 rgba(0, 0, 0, 0.05)",
    },
    errorText: {
      color: "#DB3022",
      marginTop: 8,
      textAlign: "center",
    },
    disabledButton: {
      opacity: 0.6,
    } as ViewStyle,
    testCredentialsContainer: {
      marginTop: 24,
      padding: 16,
      backgroundColor: colors.border + "40", // Semi-transparent border color
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    } as ViewStyle,
    testCredentialsTitle: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    } as ViewStyle,
    testCredentialsContent: {
      gap: 8,
    } as ViewStyle,
    credentialRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    } as ViewStyle,
    credentialLabel: {
      fontWeight: "600",
      marginRight: 8,
      minWidth: 80,
    },
    credentialValue: {
      fontFamily: "monospace",
      fontSize: 14,
    },
    copyButton: {
      marginLeft: 8,
      padding: 4,
    } as ViewStyle,
  }));

  // Redirect if already authenticated
  useEffect(() => {
    if (session) {
      routerNavigation.replace("/(tabs)");
    }
  }, [session, routerNavigation]);

  const handleLogin = async () => {
    // Mark that user has attempted to login
    setHasAttemptedLogin(true);

    if (!username.trim() || !password.trim()) {
      return;
    }

    try {
      // Use RTK Query mutation
      const result = await login({ username, password }).unwrap();

      // Store tokens in SecureStorage
      await Promise.all([
        setAccessToken(result.accessToken),
        setRefreshToken(result.refreshToken),
      ]);

      // Update Redux state
      dispatch(setLoginResponse(result));
    } catch (err) {
      // Error is handled by RTK Query and available in loginError
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error("Login failed", error, {
        username: username.trim(),
        hasPassword: !!password.trim(),
      });
    }
  };

  // Get error message from RTK Query error or validation
  const errorMessage = React.useMemo(() => {
    // Only show errors after user has attempted to login
    if (!hasAttemptedLogin) {
      return null;
    }

    // Validation error
    if (!username.trim() || !password.trim()) {
      return t("login.error.empty");
    }

    // RTK Query error
    if (loginError) {
      // Check if it's a network error or API error
      if ("status" in loginError) {
        // API error (e.g., 401, 400)
        if (loginError.status === 400 || loginError.status === 401) {
          return t("login.error.failed");
        }
      }
      return t("login.error.generic");
    }

    return null;
  }, [loginError, username, password, hasAttemptedLogin, t]);

  // Don't render login if already authenticated
  if (session) {
    return null;
  }

  return (
    <PageLayout shouldShowSafeArea={true}>
      <ThemedView style={styles.container} scrollable={false}>
        <View
          style={styles.formContainer}
          accessibilityLabel={t("login.title")}
        >
          <Typography variant="h1" color="text" style={styles.title}>
            {t("login.title")}
          </Typography>

          <CustomInput
            label={t("login.username")}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            isValid={username.length > 0}
            accessibilityLabel={t("login.username")}
            accessibilityHint={t("login.usernameHint")}
            accessibilityRole="none"
            textContentType="username"
            autoComplete="username"
          />

          <CustomInput
            label={t("login.password")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            accessibilityLabel={t("login.password")}
            accessibilityHint={t("login.passwordHint")}
            accessibilityRole="none"
            textContentType="password"
            autoComplete="password"
          />

          {errorMessage && (
            <Typography
              variant="body"
              style={styles.errorText}
              accessibilityRole="alert"
              accessibilityLiveRegion="polite"
            >
              {errorMessage}
            </Typography>
          )}

          <Button
            title={t("login.button")}
            onPress={handleLogin}
            loading={isLoading}
            disabled={!username.trim() || !password.trim()}
            buttonStyle={{ marginTop: 8 }}
            accessibilityLabel={t("login.button")}
            accessibilityHint={t("login.buttonHint")}
          />

          {/* Test Credentials Info */}
          {__DEV__ && (
            <View style={styles.testCredentialsContainer}>
              <View style={styles.testCredentialsTitle}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={colors.tint}
                  style={{ marginRight: 8 }}
                />
                <Typography variant="bodySmall" color="text" weight="600">
                  Test Credentials
                </Typography>
              </View>
              <View style={styles.testCredentialsContent}>
                <View style={styles.credentialRow}>
                  <Typography
                    variant="caption"
                    color="text"
                    style={styles.credentialLabel}
                  >
                    Username:
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text"
                    style={styles.credentialValue}
                  >
                    {TEST_CREDENTIALS.username}
                  </Typography>
                </View>
                <View style={styles.credentialRow}>
                  <Typography
                    variant="caption"
                    color="text"
                    style={styles.credentialLabel}
                  >
                    Password:
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text"
                    style={styles.credentialValue}
                  >
                    {TEST_CREDENTIALS.password}
                  </Typography>
                </View>
                <Pressable
                  onPress={fillTestCredentials}
                  style={styles.copyButton}
                  accessibilityRole="button"
                  accessibilityLabel="Fill test credentials"
                  accessibilityHint="Fills the username and password fields with test credentials"
                >
                  <Typography
                    variant="caption"
                    color="tint"
                    style={{ textDecorationLine: "underline" }}
                  >
                    Tap to fill credentials
                  </Typography>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </ThemedView>
    </PageLayout>
  );
}
