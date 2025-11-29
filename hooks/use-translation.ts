import { useTranslation as useI18nTranslation } from "react-i18next";

/**
 * Custom hook for translations with better TypeScript support.
 * This is a wrapper around react-i18next's useTranslation hook.
 * 
 * @example
 * const { t, i18n } = useTranslation();
 * const greeting = t("home.greeting");
 * 
 * @example
 * // With interpolation
 * const itemCount = t("bag.items", { count: 5 });
 */
export function useTranslation() {
  return useI18nTranslation();
}


