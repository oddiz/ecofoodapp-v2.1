import React, { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { WorkerController } from "@/modules/WorkerController";
import type { CalculateParameters, CalculateSPResult } from "@/types/food";

export const CalculateButton: React.FC = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const { selectedFoods, setCalculationResults, activeFilters } = useStore();
  const [workerController, setWorkerController] =
    useState<WorkerController | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      void import("./hillcalculator.worker").then(() => {
        const worker = new Worker(
          new URL("./hillcalculator.worker", import.meta.url),
        );
        const controller = new WorkerController(worker);
        setWorkerController(controller);
      });
    }
  }, []);

  useEffect(() => {
    if (workerController) {
      workerController.on("done", () => {
        setIsCalculating(false);
      });
      workerController.on("best_menus_update", (result: CalculateSPResult) => {
        setCalculationResults(result);
      });

      workerController.on("calculation_end", () => {
        setIsCalculating(false);
        console.log("Calculation done");
      });
    }

    return () => {
      if (workerController) {
        workerController.off("done", () => {
          setIsCalculating(false);
        });
        workerController.off("best_menus_update", () => {
          if (workerController?.bestMenus) {
            setCalculationResults(workerController?.bestMenus);
          }
        });

        workerController.off("done", () => {
          setIsCalculating(false);
          console.log("Calculation done");
        });
      }
    };
  }, [setCalculationResults, workerController]);

  function startCalculation() {
    if (!workerController || selectedFoods.length === 0) {
      console.error("WorkerController not initialized or no foods selected");
      return;
    }

    console.log("Starting calculation");
    console.log(workerController);
    setIsCalculating(true);

    const calcParams: CalculateParameters = {
      selectedFoods,
      stomachFoods: [], // Add stomach foods if needed
      filters: activeFilters,
      taste: new Map(), // Add taste preferences if needed
      menuSize: 5, // Set an appropriate menu size
      calculateType: "default", // Set the appropriate calculate type
    };

    console.log("Starting calculation with params", calcParams);

    workerController.start(calcParams);
  }

  return (
    <button
      onClick={startCalculation}
      disabled={
        selectedFoods.length === 0 || isCalculating || !workerController
      }
      className={`
        h-14 w-full flex-shrink-0 font-[Cubano] text-2xl ring-inset transition-all duration-100
        ${
          isCalculating || selectedFoods.length === 0 || !workerController
            ? "bg-ecogreen-400/20 shadow-none ring-2 ring-ecogreen-400/20 cursor-not-allowed"
            : "bg-ecogreen-500/80 shadow-[0_0px_15px_-3px] shadow-ecogreen-400 ring-2 ring-ecogreen-400/80 hover:bg-ecogreen-600/80"
        }
      `}
    >
      {isCalculating ? "Calculating..." : "Calculate"}
    </button>
  );
};
