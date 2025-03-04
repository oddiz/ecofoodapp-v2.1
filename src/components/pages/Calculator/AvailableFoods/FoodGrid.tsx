import { FoodCard } from "@/components/pages/Calculator/AvailableFoods/FoodCard";
import { useSearch } from "@/hooks/useSearch";
import type { Food } from "@/types/food";
import React, { useCallback, useMemo } from "react";
import { Plus, Check } from "lucide-react";

// Tier configuration for better display
const TIER_CONFIG = {
  4: {
    label: "Premium Foods",
    color: "bg-ecogreen-600",
    textColor: "text-ecogreen-400",
  },
  3: {
    label: "Superior Foods",
    color: "bg-ecoblue-600",
    textColor: "text-ecoblue-400",
  },
  2: {
    label: "Standard Foods",
    color: "bg-ecoyellow-600",
    textColor: "text-ecoyellow-400",
  },
  1: {
    label: "Basic Foods",
    color: "bg-ecored-500",
    textColor: "text-ecored-400",
  },
  0: {
    label: "Raw Foods",
    color: "bg-primarydark-400",
    textColor: "text-primary-300",
  },
};

const FoodGrid = React.memo(function FoodGrid({
  foods,
  onFoodClicked,
  selectedFoods,
}: {
  foods: Food[];
  onFoodClicked: (food: Food) => void;
  selectedFoods: Food[];
}) {
  const { searchInput } = useSearch();

  // Group foods by tier
  const groupedFoods = useMemo(() => {
    // Same as before
    const foodsToRender = searchInput
      ? foods.filter((food) =>
          food.name.toLowerCase().includes(searchInput.toLowerCase()),
        )
      : foods;

    return foodsToRender.reduce(
      (acc, food) => {
        const tier = food.tier;
        if (!acc[tier]) acc[tier] = [];
        acc[tier].push(food);
        return acc;
      },
      {} as Record<number, Food[]>,
    );
  }, [foods, searchInput]);

  // Sort tiers in descending order (4 to 0)
  const sortedTiers = useMemo(() => {
    return Object.keys(groupedFoods)
      .map(Number)
      .sort((a, b) => b - a);
  }, [groupedFoods]);

  // Add all foods from a tier
  const handleAddAllFromTier = useCallback(
    (foods: Food[]) => {
      foods.forEach((food) => {
        if (!selectedFoods.some((sf) => sf.id === food.id)) {
          onFoodClicked(food);
        }
      });
    },
    [onFoodClicked, selectedFoods],
  );

  const renderTierSection = useCallback(
    (tier: number) => {
      const tierFoods = groupedFoods[tier];
      const config = TIER_CONFIG[tier as keyof typeof TIER_CONFIG];

      // Check if all foods in this tier are already selected
      const allSelected = tierFoods?.every((food) =>
        selectedFoods.some((sf) => sf.id === food.id),
      );

      // Count how many are selected
      const selectedCount = tierFoods?.filter((food) =>
        selectedFoods.some((sf) => sf.id === food.id),
      ).length;

      return (
        <div key={`tier-${tier}`} className="w-full mb-6">
          <div
            className={`w-full flex items-center justify-between mb-3 px-2 py-1 border-l-4 ${config.color} border-l-4 bg-primarydark-600/30 rounded-r-md`}
          >
            <div className="flex items-center">
              <h3 className={`text-lg font-bold ${config.textColor}`}>
                {config.label} (Tier {tier})
              </h3>
              <span className="ml-2 px-2 py-0.5 bg-primarydark-600 rounded-full text-xs">
                {tierFoods?.length ?? 0}
              </span>
              {(selectedCount ?? 0) > 0 && (
                <span className="ml-1 text-xs text-primary-400">
                  ({selectedCount} selected)
                </span>
              )}
            </div>

            {/* Add All button */}
            <button
              onClick={() => handleAddAllFromTier(tierFoods ?? [])}
              disabled={allSelected}
              className={`flex items-center rounded-md px-2.5 py-1 text-xs transition-all ${
                allSelected
                  ? "bg-primarydark-500 cursor-not-allowed opacity-50"
                  : `${config.color} hover:bg-opacity-80`
              }`}
              title={
                allSelected
                  ? "All foods already selected"
                  : `Add all Tier ${tier} foods`
              }
            >
              {allSelected ? (
                <>
                  <Check size={14} className="mr-1" /> All Selected
                </>
              ) : (
                <>
                  <Plus size={14} className="mr-1" /> Add All
                </>
              )}
            </button>
          </div>

          <div className="grid md:grid-cols-2 xs:grid-cols-2 min-[925px]:grid-cols-3 min-[1200px]:grid-cols-4 w-full place-items-center gap-2">
            {tierFoods?.map((food) => (
              <FoodCard
                key={food.id}
                onFoodClick={onFoodClicked}
                food={food}
                selected={selectedFoods.some(
                  (selFood) => selFood.id === food.id,
                )}
              />
            ))}
          </div>
        </div>
      );
    },
    [groupedFoods, onFoodClicked, selectedFoods, handleAddAllFromTier],
  );

  const noResultsMessage = useMemo(() => {
    // Same as before
    if (searchInput && sortedTiers.length === 0) {
      return (
        <div className="w-full py-12 text-center text-primary-400">
          <p className="text-lg">No foods match your search</p>
          <p className="text-sm opacity-70 mt-2">Try a different search term</p>
        </div>
      );
    }
    return null;
  }, [searchInput, sortedTiers]);

  return (
    <div className="flex-grow-1 flex w-full h-full flex-col overflow-y-auto pb-10 pt-5 px-2 scrollbar">
      {noResultsMessage}

      {sortedTiers.map((tier) => renderTierSection(tier))}
    </div>
  );
});

export default FoodGrid;
