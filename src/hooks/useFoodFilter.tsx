import { useMemo } from "react";
import type { Food, FoodTier, SortableProperty } from "@/types/food";
import { useFoodStore } from "@/store/useFoodStore";
import { useServerStore } from "@/store/useServerStore";

const isSortableProperty = (property: string): property is SortableProperty => {
  return ["cal", "weight", "carb", "fat", "pro", "vit"].includes(property);
};

const getSortValue = (food: Food, property: SortableProperty): number => {
  if (isSortableProperty(property)) {
    return food[property];
  }
  return 0;
};

const getTotalNutrients = (food: Food): number => {
  return food.carb + food.vit + food.fat + food.pro;
};

export const useFoodFilter = () => {
  const { getCurrentFoods } = useServerStore();
  const { activeFilters } = useFoodStore();
  const serverFoods = getCurrentFoods();

  // Memoize the entire filtering and sorting operation
  const filteredFoods = useMemo(() => {
    // Define filter functions
    const typeFilter = (food: Food) =>
      activeFilters.type.length === 0 || activeFilters.type.includes(food.type);

    const tierFilter = (food: Food) =>
      activeFilters.tier.length === 0 ||
      activeFilters.tier.includes(`Tier-${food.tier}` as FoodTier);

    // Apply all filters in a single chain
    const filtered = serverFoods.filter(
      (food) => typeFilter(food) && tierFilter(food),
    );

    // Create a sorted copy to avoid mutating the filtered array
    return [...filtered].sort((a, b) => {
      const { id, desc } = activeFilters.sort;
      let result: number;

      if (id === "total_nutrients") {
        result = getTotalNutrients(b) - getTotalNutrients(a);
      } else if (id === "name") {
        result = a.name.localeCompare(b.name);
      } else if (isSortableProperty(id)) {
        result = getSortValue(b, id) - getSortValue(a, id);
      } else {
        result = 0;
      }

      return desc ? result : -result;
    });
  }, [serverFoods, activeFilters.type, activeFilters.tier, activeFilters.sort]);

  return filteredFoods;
};
