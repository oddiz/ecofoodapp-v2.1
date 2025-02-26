import React from "react";
import { useFoodStore } from "@/store/useFoodStore";
import { useFoodFilter } from "@/hooks/useFoodFilter";
import { type Food } from "@/types/food";
import FoodsHeader from "@/components/pages/Calculator/AvailableFoods/Header";
import FoodGrid from "@/components/pages/Calculator/AvailableFoods/FoodGrid";
import SelectedFoodsSection from "@/components/pages/Calculator/SelectedFoods";
import CalculateSection from "@/components/pages/Calculator/CalculateSection";

const CalculatorContent = () => {
  const {
    selectedFoods,
    addSelectedFood: addFood,
    removeSelectedFood: removeFood,
  } = useFoodStore();
  const availableFoods = useFoodFilter();

  const croppedFoods = availableFoods;

  const onFoodClicked = (food: Food) => {
    if (selectedFoods.some((selFood) => selFood.id === food.id)) {
      removeFood(food);
    } else {
      addFood(food);
    }
  };

  return (
    <div className="flex h-full flex-1 flex-row overflow-y-auto">
      <div
        id="foods_section"
        className="border-r-primarydark-200/40 flex h-full w-2/3 min-w-[140px] flex-col border-r-2  "
      >
        <FoodsHeader />
        <FoodGrid
          foods={croppedFoods}
          onFoodClicked={onFoodClicked}
          selectedFoods={selectedFoods}
        />
      </div>
      <div className="flex flex-col w-1/3 min-w-[240px] border-r-primarydark-200/40 h-full border-r-2">
        <SelectedFoodsSection
          selectedFoods={selectedFoods}
          removeFood={removeFood}
        />
        <CalculateSection />
      </div>
    </div>
  );
};

export default CalculatorContent;
