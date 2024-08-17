import { Food, IBestMenus, ICalculateFilters, ICalcWorkerMessage, IFoods } from "@/types/food";
import { FilterState } from "../Header/FilterButton";
import { useState, useRef } from "react";
import { Calculator } from "@/modules/Calculator";
export function CalculateSection({ getFoods }: { getFoods: () => IFoods }) {
    const [calcFilters, setCalcFilters] = useState<ICalculateFilters | null>(null);

    const [results, setResults] = useState<IBestMenus[]>([]);
    function startCalculation() {
        const filters = calcFilters;
        const foods = getFoods();
        const taste = JSON.parse(window.localStorage.getItem("taste") || "{}");
        if (filters) {
            console.log(filters);
        }
        const CalculateController = new Calculator(foods, filters, taste);

        CalculateController.on("best_menus_update", (bestMenus) => {
            console.log(bestMenus);
            setResults((prev) => [...prev, bestMenus]);
        });
        CalculateController.start();
    }
    return (
        <div
            id="selected-foods"
            className=" m-0 flex h-full w-full flex-col items-center  overflow-hidden   "
        >
            <button
                onClick={startCalculation}
                className="pointer-cursor h-10 w-10 bg-ecogreen-500 "
            >
                Calculate
            </button>
            {results.map((result, i) => (
                <div key={i}>{result.scholar?.result.sp}</div>
            ))}
        </div>
    );
}
