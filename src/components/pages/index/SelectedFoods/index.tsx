import React from "react";
import { type Food } from "@/types/food";
import Image from "next/image";
import { ImCross } from "react-icons/im";
import { CalculateButton } from "@/components/pages/index/SelectedFoods/CalculateButton";

const SelectedFoodItem = React.memo(
  ({ food, removeFood }: { food: Food; removeFood: (food: Food) => void }) => (
    <div className="flex w-full items-center border-b-2 border-primarydark-400 pr-4">
      <Image
        width={44}
        height={44}
        alt={`${food.name} image`}
        src={`/img/foods/${food.id}.png`}
      />
      <div className="mx-4">{food.name}</div>
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
      <div className="flex h-full w-full flex-col border-primarydark-200/40 border-1">
        <div className="bg-primarydark-600 flex h-16 w-full flex-row items-center justify-center border-b-2 border-primarydark-200/40 px-6">
          <span className="text-ecored-300/80 font-[Cubano] text-2xl">
            Selected Foods
          </span>
        </div>
        <div className="flex-grow overflow-y-auto text-primary-700">
          {selectedFoods.map((food) => (
            <SelectedFoodItem
              key={food.id}
              food={food}
              removeFood={removeFood}
            />
          ))}
        </div>
        <CalculateButton />
      </div>
    );
  },
);

SelectedFoodsSection.displayName = "SelectedFoodsSection";
export default SelectedFoodsSection;
