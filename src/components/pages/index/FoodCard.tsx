import PieChartFromFood from "@/components/PieChart";
import { Tooltip } from "@/components/Tooltip";
import { type Food } from "@/types/food";
import Image from "next/image";
import { useState } from "react";
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
    const [showPie, setShowPie] = useState(false);
    const totalNutrients = food.carb + food.fat + food.pro + food.vit;

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
                    ? "bg-primarydark-300 dark:border-ecogreen-400"
                    : "bg-primarydark-500 dark:border-primarydark-100"
            } flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-lg border-[1px] px-4 pb-2 pt-4 relative`}
        >
            <div className="flex h-full flex-row">
                <div className="flex max-w-[155px] flex-1 flex-col">
                    <div className="flex max-h-20 flex-1 flex-col overflow-hidden ">
                        <h1 className="mb-1 h-[40px] overflow-ellipsis text-base font-bold leading-tight">
                            {food.name}
                        </h1>
                        <span className="m-0 text-sm dark:opacity-30">Tier {food.tier}</span>
                        <span className="m-0 text-sm dark:opacity-30">{food.type}</span>
                    </div>
                    <div className="mt-auto flex flex-row justify-self-end">
                        <Tooltip message="Weight">
                            <FaWeightHanging className="text-base text-gray-400/40" />
                        </Tooltip>
                        <div className="mx-1 text-sm font-bold text-primary-600/50">{food.weight}</div>
                        <Tooltip message="Calories">
                            <FaFire className="ml-2 text-base text-ecoyellow-500/40" />
                        </Tooltip>
                        <div className="mx-1 text-sm font-bold text-primary-600/50">{food.cal}</div>
                        {!showPie && (
                            <>
                                <Tooltip message="Total Nutrients">
                                    <FaNutritionix className="ml-2 text-base text-ecogreen-300/70" />
                                </Tooltip>
                                <div className="mx-1 text-sm font-bold text-primary-600/50">{totalNutrients}</div>
                            </>
                        )}
                    </div>
                </div>
                <div className="ml-auto flex h-full flex-shrink-0 flex-col items-end justify-self-end">
                    {!showPie && (
                        <Image
                            width={42}
                            height={42}
                            alt={`${food.name} image`}
                            src={`/img/foods/${food.id}.png`}
                        />
                    )}
                    <div
                        onClick={() => setShowPie(!showPie)}
                        className={`pie_chart absolute ${
                            showPie ? "right-2 bottom-2 h-24 w-24" : "bottom-2 right-2 h-9 w-9"
                        } cursor-pointer justify-self-center transition-all duration-100`}
                    >
                        <PieChartFromFood
                            interactive={true}
                            labels={showPie}
                            food={food}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
