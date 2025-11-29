import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

/**
 * Param list for the bottom tabs navigator
 * Maps each tab screen name to its expected route parameters
 */
export type TabParamList = {
  index: undefined; // Home screen
  shop: undefined;
  bag: undefined;
  favorites: undefined;
  profile: undefined;
};

/**
 * Param list for the root stack navigator
 * Maps each stack screen name to its expected route parameters
 */
export type RootStackParamList = {
  "(tabs)": NavigatorScreenParams<TabParamList>;
  // Add other stack screens here as needed
  // Example: "product-details": { productId: string };
};

/**
 * Props type for tab screens
 *
 * @template T - The screen name from TabParamList
 *
 * @example
 * ```tsx
 * type HomeScreenProps = TabScreenProps<"index">;
 *
 * export default function HomeScreen({ navigation, route }: HomeScreenProps) {
 *   // navigation and route are fully typed
 *   navigation.navigate("shop");
 * }
 * ```
 */
export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<RootStackParamList, "(tabs)">
>;

/**
 * Props type for stack screens
 *
 * @template T - The screen name from RootStackParamList
 *
 * @example
 * ```tsx
 * type ProductDetailsScreenProps = RootStackScreenProps<"product-details">;
 *
 * export default function ProductDetailsScreen({ navigation, route }: ProductDetailsScreenProps) {
 *   const productId = route.params.productId;
 *   navigation.goBack();
 * }
 * ```
 */
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

/**
 * Global type declaration for React Navigation
 * This enables type checking for useNavigation, Link, etc. throughout the app
 *
 * @see https://reactnavigation.org/docs/typescript/#specifying-default-types-for-usenavigation-link-ref-etc
 */
declare global {
  namespace ReactNavigation {
    // This interface intentionally extends without adding members for React Navigation type augmentation
    // It's required for useNavigation, Link, etc. to work with proper types
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
