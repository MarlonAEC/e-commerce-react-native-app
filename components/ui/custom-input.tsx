import { AnimatedThemedView } from "@/components/animated-themed-view";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  TextInput,
  TextInputProps,
  View,
  type ViewStyle,
} from "react-native";
import { ThemedView } from "../themed-view";
import { CheckMarkIcon } from "./svg-icons/check-mark-icon";

type CustomInputProps = TextInputProps & {
  /**
   * Label text that will animate to the top when focused or has value
   */
  label?: string;
  /**
   * Whether the input is valid (shows green checkmark)
   */
  isValid?: boolean;
  /**
   * Custom border color when focused (defaults to purple)
   */
  focusedBorderColor?: string;
};

export default function CustomInput({
  value,
  onChangeText,
  placeholder,
  label,
  isValid,
  focusedBorderColor = "#9333EA", // Purple color
  onFocus,
  onBlur,
  ...restProps
}: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const animatedLabelPosition = useRef(new Animated.Value(0)).current;
  const animatedLabelSize = useRef(new Animated.Value(1)).current;
  const animatedBorderColor = useRef(new Animated.Value(0)).current;

  const hasValue = Boolean(value && value.length > 0);
  const shouldShowLabelAtTop = isFocused || hasValue;

  const { styles, colors } = useThemedStyles((colors) => ({
    container: {
      width: "100%",
      marginBottom: 16,
      position: "relative",
    } as ViewStyle,
    inputContainer: {
      width: "100%",
      minHeight: 64,
      borderWidth: 0,
      borderRadius: 4,
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      justifyContent: "center",
      position: "relative",
      // Box shadow: 0px 1px 8px rgba(0, 0, 0, 0.05)
      ...(Platform.OS === "ios"
        ? {
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: colors.background === "#151718" ? 0.5 : 0.05,
            shadowRadius: 8,
          }
        : {
            elevation: 2,
          }),
    } as ViewStyle,
    input: {
      width: "100%",
      color: colors.text,
      fontSize: 16,
      paddingBottom: 20, // Adjusted for 64px height
      paddingLeft: 0,
    },
    labelContainer: {
      position: "absolute",
      left: 16,
      pointerEvents: "none",
    } as ViewStyle,
    checkmarkContainer: {
      position: "absolute",
      right: 16,
      top: "50%",
      transform: [{ translateY: -8 }], // Adjusted for 64px height (32px center - 8px for icon)
    } as ViewStyle,
  }));

  useEffect(() => {
    // Animate label position and size
    Animated.parallel([
      Animated.timing(animatedLabelPosition, {
        toValue: shouldShowLabelAtTop ? 1 : 0,
        duration: 200,
        useNativeDriver: false, // We need to animate top/left which doesn't support native driver
      }),
      Animated.timing(animatedLabelSize, {
        toValue: shouldShowLabelAtTop ? 1 : 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(animatedBorderColor, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [
    shouldShowLabelAtTop,
    isFocused,
    animatedLabelPosition,
    animatedLabelSize,
    animatedBorderColor,
  ]);

  const labelTop = animatedLabelPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [22, 5], // From center (22 = 64/2 - 10) to top (5)
  });

  const labelFontSize = animatedLabelPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12], // From large (16) to small (12)
  });

  const borderColor = animatedBorderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, focusedBorderColor],
  });

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const displayLabel = label || placeholder;

  return (
    <ThemedView style={styles.container}>
      <AnimatedThemedView
        style={[
          styles.inputContainer,
          {
            borderColor: borderColor,
          },
        ]}
      >
        {displayLabel && (
          <Animated.View
            style={[
              styles.labelContainer,
              {
                top: labelTop,
              },
            ]}
          >
            <Animated.Text
              style={{
                fontSize: labelFontSize,
                color: colors.tabIconDefault,
              }}
            >
              {displayLabel}
            </Animated.Text>
          </Animated.View>
        )}

        <TextInput
          style={[
            styles.input,
            {
              paddingTop: shouldShowLabelAtTop ? 24 : 0, // Adjusted for 64px height
              paddingRight: isValid ? 40 : 0, // Make room for checkmark
            },
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={shouldShowLabelAtTop ? undefined : placeholder}
          placeholderTextColor={colors.tabIconDefault}
          {...restProps}
        />

        {isValid && (
          <View style={styles.checkmarkContainer}>
            <CheckMarkIcon />
          </View>
        )}
      </AnimatedThemedView>
    </ThemedView>
  );
}
