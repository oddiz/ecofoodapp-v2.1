import React, { useEffect, useCallback, useMemo } from "react";
import { useNavigator } from "@/hooks/useNavigator";
import { useSearch } from "@/hooks/useSearch";
import { allFoods } from "@/data/foodData";
import { useStore } from "@/store/useStore";
import { useFoodFilter } from "@/hooks/useFoodFilter";
import { type Food } from "@/types/food";
import { CalculateResultsSection } from "@/components/pages/index/Calculate/CalculateResultsSection";
import SelectedFoodsSection from "@/components/pages/index/SelectedFoods";
import FoodsHeader from "@/components/pages/index/AvailableFoods/Header";
import FoodGrid from "@/components/pages/index/AvailableFoods/FoodGrid";

const CalculatorContent = () => {
  const { setActivePage } = useNavigator();
  const { searchInput } = useSearch();
  const { selectedFoods, activeFilters, addFood, removeFood } = useStore();

  useEffect(() => {
    setActivePage("home");
  }, [setActivePage]);

  const filteredFoods = useFoodFilter(allFoods, activeFilters, searchInput);

  const croppedFoods = filteredFoods.slice(0, 12);

  const onFoodClicked = useCallback(
    (food: Food) => {
      if (selectedFoods.some((selFood) => selFood.id === food.id)) {
        removeFood(food);
      } else {
        addFood(food);
      }
    },
    [selectedFoods, removeFood, addFood],
  );

  return (
    <div className="flex h-full flex-1 flex-row overflow-hidden">
      <div
        id="foods_section"
        className="border-r-primarydark-200/40 flex h-full w-7/12 min-w-[540px] flex-col border-r-2 overflow-scroll overflow-x-hidden"
      >
        <FoodsHeader />
        <FoodGrid
          foods={croppedFoods}
          onFoodClicked={onFoodClicked}
          selectedFoods={selectedFoods}
        />
      </div>
      <div className="border-r-primarydark-200/40 flex h-full  w-2/12 min-w-[300px] flex-col border-r-2">
        <SelectedFoodsSection
          selectedFoods={selectedFoods}
          removeFood={removeFood}
        />
      </div>
      <div className="border-r-primarydark-200/40 flex h-full  w-3/12 min-w-[400px] flex-1 flex-col border-r-2">
        <CalculateResultsSection />
      </div>
    </div>
  );
};

export default CalculatorContent;
