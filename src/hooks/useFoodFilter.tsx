import { useMemo } from "react";
import type { Food, FilterState, FoodTier, SortableProperty } from "@/types/food";



const isSortableProperty = (property: string): property is SortableProperty => {
  return ['cal', 'weight', 'carb', 'fat', 'pro', 'vit'].includes(property);
};

const getSortValue = (food: Food, property: SortableProperty): number => {
  if (isSortableProperty(property)) {
    return food[property];
  }
  return 0;
};

export const useFoodFilter = (
  foods: Food[],
  filters: FilterState,
  searchInput: string
) => {
  return useMemo(() => {
    let filteredFoods = foods;

    // Apply search filter
    if (searchInput.length > 0) {
      filteredFoods = filteredFoods.filter((food) => 
        food.name.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    // Apply type filter
    if (filters.type.length > 0) {
      filteredFoods = filteredFoods.filter((food) => 
        filters.type.includes(food.type)
      );
    }

    // Apply tier filter
    if (filters.tier.length > 0) {
      filteredFoods = filteredFoods.filter((food) => 
        filters.tier.includes(("Tier-" + String(food.tier)) as FoodTier)
      );
    }

    // Sort foods
    filteredFoods.sort((a, b) => {
      const { id, desc } = filters.sort;
      let result: number;

      if (id === "total_nutrients") {
        result = (b.carb + b.vit + b.fat + b.pro) - (a.carb + a.vit + a.fat + a.pro);
      } else if (id === "name") {
        result = a.name.localeCompare(b.name);
      } else if (isSortableProperty(id)) {
        result = getSortValue(b, id) - getSortValue(a, id);
      } else {
        result = 0;
      }

      return desc ? result : -result;
    });

    return filteredFoods;
  }, [foods, filters, searchInput]);
};
