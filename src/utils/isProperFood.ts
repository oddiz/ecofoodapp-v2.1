import type { Item } from "@/types/allitems";

/**
 * Determines if an item is proper food based on specified criteria
 * @param {Object} item - The food item to check
 * @param {Array<string>} item.tags - Array of tags associated with the item
 * @param {number} item.calories - Caloric content of the item
 * @returns {boolean} - True if the item meets all criteria, false otherwise
 */
export function   isProperFood(item: Item) {
  // Check if item has required properties
  if (
    !item?.Tags ||
    !Array.isArray(item.Tags) ||
    typeof item.PropertyInfos.Calories?.Single !== "string"
  ) {
    return false;
  }

  const calorieValue = Number(item.PropertyInfos.Calories?.Single);
  // Check if calories are over 200
  if (calorieValue <= 200) {
    return false;
  }

  // Check if required tags are present
  const hasRequiredTags =
    item.Tags.includes("Food") && item.Tags.includes("Product");
  if (!hasRequiredTags) {
    return false;
  }

  // Optional tags that could be present
  const validOptionalTags = [
    "CharredVegetable",
    "CampfireSalad",
    "CharredGreen",
    "Bread",
    "Salad",
    "BakedVegetable",
    "BakedFood",
    "CharredFruit",
    "FriedVegetable",
    "Juice",
  ];

  // All tags should be either required tags or from validOptionalTags
  const allTagsValid = item.Tags.every(
    (tag) =>
      tag === "Food" ||
      tag === "Product" ||
      tag == "Ingredient" ||
      validOptionalTags.includes(tag) ||
      tag === "CanBeOnSurface",
  );
  return allTagsValid;
}
