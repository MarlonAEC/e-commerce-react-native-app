import PageLayout from "@/components/page-layout";
import { ThemedView } from "@/components/themed-view";
import { Typography } from "@/components/ui/typography";

export default function ShopScreen() {
  return (
    <PageLayout shouldShowSafeArea={true}>
      <ThemedView style={{ flex: 1, padding: 16 }} scrollable={false}>
        <Typography variant="h1">Shop</Typography>
      </ThemedView>
    </PageLayout>
  );
}

