import { TabScreenProps } from "@/@types/navigation";
import MasonryCategoryList from "@/components/masonry-category-list";
import PageLayout from "@/components/page-layout";

type HomeScreenProps = TabScreenProps<"index">;

export default function HomeScreen({ navigation, route }: HomeScreenProps) {
  return (
    <PageLayout shouldShowSafeArea={false}>
      <MasonryCategoryList />
      {/**
       * This is a test button to trigger an error and test the error boundary.
       * uncomment it to test the error boundary.
       * <ErrorTestButton />
       **/}
    </PageLayout>
  );
}
