import React from "react";
import { type Food } from "@/types/food";

import { ImCross } from "react-icons/im";

const SelectedFoodItem = React.memo(
  ({ food, removeFood }: { food: Food; removeFood: (food: Food) => void }) => (
    <div className="flex w-full items-center border-b-2 border-primarydark-400 pr-4">
      <div className="m-1">{food.name}</div>
      <button
        className="ml-auto h-full justify-self-end"
        onClick={() => removeFood(food)}
      >
        <ImCross className="text-ecored-300" />
      </button>
    </div>
  ),
);

SelectedFoodItem.displayName = "SelectedFoodItem";

const SelectedFoodsSection = React.memo(
  ({
    selectedFoods,
    removeFood,
  }: {
    selectedFoods: Food[];
    removeFood: (food: Food) => void;
  }) => {
    return (
      <div className="flex h-full w-full overflow-hidden flex-col bg-primarydark-600 border-primarydark-200/40 border-1">
        <div className=" flex h-16 w-full flex-shrink-0 flex-row items-center justify-center border-b-[1px] border-primarydark-200/30 px-6 text-ecored-300/80 font-[Cubano] text-2xl">
          Selected Foods
        </div>
        <div className="flex-1 overflow-y-auto text-primary-700">
          {selectedFoods.map((food) => (
            <SelectedFoodItem
              key={food.id}
              food={food}
              removeFood={removeFood}
            />
          ))}
        </div>
      </div>
    );
  },
);

SelectedFoodsSection.displayName = "SelectedFoodsSection";
export default SelectedFoodsSection;
