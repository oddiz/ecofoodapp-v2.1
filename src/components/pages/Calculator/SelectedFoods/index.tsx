import React from "react";
import { type Food } from "@/types/food";
import { X } from "lucide-react";

const SelectedFoodItem = React.memo(
  ({ food, removeFood }: { food: Food; removeFood: (food: Food) => void }) => {
    return (
      <div className="group flex w-full items-center justify-between p-2.5 border-b border-primarydark-500/40 hover:bg-primarydark-500/30 transition-colors">
        <div className="flex flex-1 min-w-0">
          <div className="flex items-center">
            <span className="text-sm text-primary-200 font-medium truncate">
              {food.name}
            </span>
            <span
              className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${getTierColor(food.tier)}`}
            >
              T{food.tier}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-0.5 ml-auto">
            {/* Nutrition bars */}
            <div className="flex-1 flex items-center gap-1">
              <NutrientBar value={food.carb} color="bg-ecored-500" label="C" />
              <NutrientBar
                value={food.pro}
                color="bg-ecoyellow-500"
                label="P"
              />
              <NutrientBar value={food.fat} color="bg-[#ffd21c]" label="F" />
              <NutrientBar value={food.vit} color="bg-ecogreen-500" label="V" />
            </div>
          </div>
        </div>

        <button
          onClick={() => removeFood(food)}
          className="ml-2 p-1.5 rounded-full opacity-70 hover:opacity-100 hover:bg-ecored-600/20 transition-all group-hover:opacity-100"
          aria-label="Remove food"
        >
          <X size={14} className="text-ecored-400" />
        </button>
      </div>
    );
  },
);

const NutrientBar = ({
  value,
  color,
  label,
}: {
  value: number;
  color: string;
  label: string;
}) => {
  return (
    <div className="flex flex-col items-center" title={`${label}: ${value}`}>
      <div className="w-4 h-10 bg-primarydark-700/60 rounded-sm overflow-hidden flex items-end">
        <div
          className={`w-full ${color}`}
          style={{ height: `${Math.min(value * 5, 100)}%` }}
        ></div>
      </div>
      <span className="text-[9px] mt-0.5 text-primary-400">{label}</span>
    </div>
  );
};

function getTierColor(tier: number): string {
  switch (tier) {
    case 4:
      return "bg-ecogreen-600 text-white";
    case 3:
      return "bg-ecoblue-600 text-white";
    case 2:
      return "bg-ecoyellow-600 text-primarydark-800";
    case 1:
      return "bg-ecored-500 text-white";
    default:
      return "bg-primarydark-400 text-primary-200";
  }
}

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
      <div className="flex h-full w-full overflow-hidden flex-col bg-primarydark-700 border-primarydark-500/40 border rounded-lg shadow-inner">
        <div className="flex h-14 items-center justify-between px-4 border-b border-primarydark-600">
          <h2 className="font-semibold text-lg text-primary-100">
            Selected Foods
          </h2>
        </div>

        {selectedFoods.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-primary-400 text-sm italic p-4 text-center">
            Select foods from the list to create your menu
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto scrollbar">
            {selectedFoods.map((food) => (
              <SelectedFoodItem
                key={food.id}
                food={food}
                removeFood={removeFood}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);

SelectedFoodsSection.displayName = "SelectedFoodsSection";
export default SelectedFoodsSection;
