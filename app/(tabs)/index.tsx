import { TabScreenProps } from "@/@types/navigation";
import MasonryCategoryList from "@/components/masonry-category-list";
import PageLayout from "@/components/page-layout";
import { useAppSelector } from "@/hooks/use-redux-toolkit";
import { selectCategories } from "@/redux/categories/categories-slice";

type HomeScreenProps = TabScreenProps<"index">;

export default function HomeScreen({ navigation, route }: HomeScreenProps) {
  const categories = useAppSelector(selectCategories);
  return (
    <PageLayout shouldShowSafeArea={false}>
      <MasonryCategoryList categories={categories} />
      {/**
       * This is a test button to trigger an error and test the error boundary.
       * uncomment it to test the error boundary.
       * <ErrorTestButton />
       **/}
    </PageLayout>
  );
}
