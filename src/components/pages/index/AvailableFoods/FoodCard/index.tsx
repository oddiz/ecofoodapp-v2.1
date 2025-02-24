import PieChartFromFood from "@/components/pages/index/AvailableFoods/FoodCard/PieChart";
import { Tooltip } from "@/components/Tooltip";
import { type Food } from "@/types/food";
import { FaWeightHanging, FaFire, FaNutritionix } from "react-icons/fa";

export function FoodCard({
  food,
  onFoodClick,
  selected,
}: {
  food: Food;
  onFoodClick: (food: Food) => void;
  selected: boolean;
}) {
  const foodClicked = (event: React.MouseEvent) => {
    if ((event.target as Element).closest(".pie_chart")) {
      return;
    }
    onFoodClick(food);
  };

  return (
    <div
      onClick={foodClicked}
      className={`${
        selected
          ? "bg-primarydark-300 border-ecogreen-400"
          : "bg-primarydark-500 border-primarydark-100"
      } flex cursor-pointer flex-col rounded-lg border-[1px] p-2 relative w-full mx-2`}
    >
      <FoodCardHeader food={food} />
      <span className="m-0 text-xs opacity-30">Tier {food.tier}</span>
      <span className="m-0 text-xs opacity-30">{food.type}</span>
      <FoodStats food={food} />
    </div>
  );
}

const FoodCardHeader = ({ food }: { food: Food }) => (
  <div className="flex flex-row items-center ">
    <h1 className="mb-1 overflow-ellipsis flex-1 text-sm font-bold leading-tight">
      {food.name}
    </h1>
    <div
      className={`pie_chart bottom-2 right-2 h-9 w-9 justify-self-center transition-all duration-100`}
    >
      <PieChartFromFood interactive={true} labels={false} food={food} />
    </div>
  </div>
);

function FoodStats({ food }: { food: Food }) {
  const totalNutrients = food.carb + food.fat + food.pro + food.vit;

  return (
    <div className="mt-2 flex flex-row justify-self-end">
      <Tooltip message="Weight">
        <FaWeightHanging className="text-xs text-gray-400/40" />
      </Tooltip>
      <div className="mx-1 text-xs font-bold text-primary-600/50">
        {food.weight}
      </div>
      <Tooltip message="Calories">
        <FaFire className="ml-2 text-xs text-ecoyellow-500/40" />
      </Tooltip>
      <div className="mx-1 text-xs font-bold text-primary-600/50">
        {food.cal}
      </div>
      <Tooltip message="Total Nutrients">
        <FaNutritionix className="ml-2 text-xs text-ecogreen-300/70" />
      </Tooltip>
      <div className="mx-1 text-xs font-bold text-primary-600/50">
        {totalNutrients}
      </div>
    </div>
  );
}
