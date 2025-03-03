import { FoodCard } from "@/components/pages/Calculator/AvailableFoods/FoodCard";
import type { Food } from "@/types/food";
import React, { useMemo } from "react";

const FoodGrid = ({
  foods,
  onFoodClicked,
  selectedFoods,
}: {
  foods: Food[];
  onFoodClicked: (food: Food) => void;
  selectedFoods: Food[];
}) => {
  const MAX_FOODS = 24;
  const [renderUntil, setRenderUntil] = React.useState<number>(MAX_FOODS);

  const renderFoods = () => {
    const foodsToRender = foods.slice(0, renderUntil);

    return foodsToRender.map((food) => (
      <FoodCard
        key={food.id}
        onFoodClick={onFoodClicked}
        food={food}
        selected={selectedFoods.some((selFood) => selFood.id === food.id)}
      />
    ));
  };

  const loadMoreButton = useMemo(() => {
    if (foods.length > renderUntil) {
      return (
        <div
          key="showrestbutton"
          className="my-10 flex h-52 w-full items-start justify-center"
        >
          <button
            type="button"
            className="flex h-14 items-center justify-center rounded-xl p-6 text-base bg-purple-500/40"
            onClick={() => setRenderUntil((prev) => prev + MAX_FOODS)}
          >
            Load more...
          </button>
        </div>
      );
    }
    return null;
  }, [foods.length, renderUntil]);

  return (
    <div className="flex-grow-1 flex w-full h-full flex-col overflow-y-auto pb-10 pt-5 px-2">
      <div className="grid md:grid-cols-2 xs:grid-cols-2 min-[925px]:grid-cols-3 min-[1200px]:grid-cols-4 w-full place-items-center col-span-2 gap-2 ">
        {renderFoods()}
      </div>
      {loadMoreButton}
    </div>
  );
};

export default FoodGrid;
