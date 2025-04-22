import { category } from "@/types/category";

export function extractCategoryPath(selectedCategory: {
  [key: string]: category[];
}): string[] {
  return Object.keys(selectedCategory)
    .sort(
      (a, b) =>
        parseInt(a.replace("dropdown", "")) -
        parseInt(b.replace("dropdown", ""))
    )
    .map((key: string) => {
      const categoryItem = selectedCategory[key][0]; // Get first selected category
      return categoryItem.id ? categoryItem.id : categoryItem.category; // Use id if exists, otherwise use category name
    });
}
