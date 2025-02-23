import { FoodCard } from "@/components/pages/index/FoodCard";
import type { Food } from "@/types/food";
import React, { useMemo } from "react";

const FoodGrid = React.memo(function FoodGrid({
  foods,
  onFoodClicked,
  selectedFoods,
}: {
  foods: Food[];
  onFoodClicked: (food: Food) => void;
  selectedFoods: Food[];
}) {
  const [showRest, setShowRest] = React.useState(false);
  const MAX_FOODS = 12;

  const renderFoods = useMemo(() => {
    const renderUntil = showRest ? undefined : MAX_FOODS;
    const foodsToRender = foods.slice(0, renderUntil);

    return foodsToRender.map((food) => (
      <FoodCard
        key={food.id}
        onFoodClick={onFoodClicked}
        food={food}
        selected={selectedFoods.some((selFood) => selFood.id === food.id)}
      />
    ));
  }, [foods, showRest, selectedFoods, onFoodClicked]);

  const loadMoreButton = useMemo(() => {
    if (foods.length > MAX_FOODS && !showRest) {
      return (
        <div
          key="showrestbutton"
          className="my-10 flex h-52 w-full items-start justify-center"
        >
          <button
            type="button"
            className="flex h-14 items-center justify-center rounded-xl p-6 text-base bg-purple-500/40"
            onClick={() => setShowRest(true)}
          >
            Load more...
          </button>
        </div>
      );
    }
    return null;
  }, [foods.length, showRest]);

  return (
    <div className="flex-grow-1 flex w-full flex-col  pb-10 pt-5">
      <div className="grid grid-cols-2 gap-y-5 w-full place-items-center col-span-2 ">
        {renderFoods}
      </div>
      {loadMoreButton}
    </div>
  );
});

export default FoodGrid;
