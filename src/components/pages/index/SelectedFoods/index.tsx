import React from "react";
import { type Food } from "@/types/food";
import Image from "next/image";
import { ImCross } from "react-icons/im";
import { CalculateButton } from "@/components/pages/index/SelectedFoods/CalculateButton";

const SelectedFoodItem = React.memo(({ food, removeFood }: { food: Food; removeFood: (food: Food) => void }) => (
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
));

SelectedFoodItem.displayName = 'SelectedFoodItem';

export const SelectedFoodsSection = React.memo(({
  selectedFoods,
  removeFood,
}: {
  selectedFoods: Food[] | null;
  removeFood: (food: Food) => void;
}) => {
  if (!selectedFoods || selectedFoods.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <p className="text-center text-gray-500">No foods selected</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-grow overflow-y-auto">
        {selectedFoods.map((food) => (
          <SelectedFoodItem key={food.id} food={food} removeFood={removeFood} />
        ))}
      </div>
        <CalculateButton />
    </div>
  );
});

SelectedFoodsSection.displayName = 'SelectedFoodsSection';
