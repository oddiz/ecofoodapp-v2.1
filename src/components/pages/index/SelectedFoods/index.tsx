import { type Food } from "@/types/food";
import Image from "next/image";
import { ImCross } from "react-icons/im";
import { layout } from "react-stonecutter";
import { GridComponent } from "@/components/pages/index/IndexContent";

export function SelectedFoodsSection({
    selectedFoods,
    removeFood,
}: {
    selectedFoods: Food[] | null;
    removeFood: (food: Food) => void;
}) {
    if (!selectedFoods) return <></>;
    const disabled = selectedFoods.length === 0;
    const reverseFoods = [...selectedFoods].reverse();
    return (
        <div
            id="selected-foods"
            className=" m-0 flex h-full w-full flex-col items-center  overflow-hidden   "
        >
          
                <div className="block justify-self-center"
                >
                <GridComponent
                    component="div"
                    columns={1}
                    columnWidth={398}
                    itemHeight={44}
                    gutterHeight={2}
                    layout={layout.simple}
                    duration={150}
                >
                    {reverseFoods.map((food) => (
                        <div
                            className="flex w-full justify-center"
                            key={food.id}
                        >
                            <SelectedFoodItem
                                food={food}
                                removeFood={removeFood}
                            />
                        </div>
                    ))}
                </GridComponent>
                </div>
            <button
                className={
                    (disabled
                        ? "bg-ecogreen-400/20 shadow-none ring-2 ring-ecogreen-400/20"
                        : "bg-ecogreen-500/80 shadow-[0_0px_15px_-3px] shadow-ecogreen-400 ring-2  ring-ecogreen-400/80") +
                    " " +
                    "h-14 w-full flex-shrink-0 font-[Cubano] text-2xl ring-inset transition-all duration-100 "
                }
            >
                Calculate
            </button>
        </div>
    );
}

// Language: typescript
// Path: src\components\pages\index\SelectedFoods\FoodItem\index.tsx
function SelectedFoodItem({ food, removeFood }: { food: Food; removeFood: (food: Food) => void }) {
    const { name } = food;

    return (
        <div
            key={food.id}
            className=" flex w-full items-center border-b-2 border-primarydark-400 pr-4  "
        >
            <Image
                width={44}
                height={44}
                className={" "}
                alt={food.name + " image"}
                src={`/img/foods/${food.id}.png`}
            />
            <div className="mx-4">{name}</div>
            <button
                className="ml-auto h-full justify-self-end"
                onClick={() => removeFood(food)}
            >
                <ImCross className="text-ecored-300" />
            </button>
        </div>
    );
}
