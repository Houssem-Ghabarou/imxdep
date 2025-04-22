import firestore from "@react-native-firebase/firestore";

export const saveCategoryPathToFirestore = async (
  categoryPath: string[],
  companyId: string,
  collectionName: string
) => {
  let parentId = null; // Root categories will have `null` as `parentId`
  let lastCategoryId = null;
  let categoryPathIds = []; // This will store the IDs of each category in the path

  for (const category of categoryPath) {
    if (!category) continue;

    if (category.length === 20) {
      // Likely an existing Firestore document ID (Firestore IDs are usually 20 characters)
      lastCategoryId = category;
      parentId = category; // Move to the next category in the hierarchy
    } else {
      // This is a new category (since it doesn't have an ID)
      try {
        // Check if a category with the same name and parentId already exists
        const existingCategoryQuery = await firestore()
          .collection("Company")
          .doc(companyId)
          .collection(collectionName)
          .where("category", "==", category)
          .where("parentId", "==", parentId)
          .get();

        if (!existingCategoryQuery.empty) {
          // If a matching category exists, use its ID
          lastCategoryId = existingCategoryQuery.docs[0].id;
        } else {
          // If no matching category exists, create a new one
          const newCategoryRef = await firestore()
            .collection("Company")
            .doc(companyId)
            .collection(collectionName)
            .add({
              category: category, // The category name
              parentId: parentId, // Link to the parent category
            });

          lastCategoryId = newCategoryRef.id;
        }

        parentId = lastCategoryId; // Set parentId for next category in the path
      } catch (error) {
        return null;
      }
    }

    // Add the category ID to the path
    categoryPathIds.push(lastCategoryId);
  }

  return categoryPathIds; // Return the array with all category IDs in the path
};
