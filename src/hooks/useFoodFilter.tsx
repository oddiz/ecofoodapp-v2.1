import { useMemo } from "react";
import type { Food, FoodTier, SortableProperty } from "@/types/food";
import { useFoodStore } from "@/store/useFoodStore";
import { useSearch } from "@/hooks/useSearch";
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

export const useFoodFilter = () => {
  const { currentServerFoods } = useServerStore();
  const { activeFilters } = useFoodStore();
  const { searchInput } = useSearch();
  return useMemo(() => {
    let filteredFoods = currentServerFoods;

    // Apply search filter
    if (searchInput.length > 0) {
      filteredFoods = filteredFoods.filter((food) =>
        food.name.toLowerCase().includes(searchInput.toLowerCase()),
      );
    }

    // Apply type filter
    if (activeFilters.type.length > 0) {
      filteredFoods = filteredFoods.filter((food) =>
        activeFilters.type.includes(food.type),
      );
    }

    // Apply tier filter
    if (activeFilters.tier.length > 0) {
      filteredFoods = filteredFoods.filter((food) =>
        activeFilters.tier.includes(("Tier-" + String(food.tier)) as FoodTier),
      );
    }

    // Sort foods
    filteredFoods.sort((a, b) => {
      const { id, desc } = activeFilters.sort;
      let result: number;

      if (id === "total_nutrients") {
        result =
          b.carb + b.vit + b.fat + b.pro - (a.carb + a.vit + a.fat + a.pro);
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
  }, [
    activeFilters.sort,
    activeFilters.tier,
    activeFilters.type,
    currentServerFoods,
    searchInput,
  ]);
};
