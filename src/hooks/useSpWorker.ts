// src/utils/useSpWorker.ts

import { useState, useEffect, useCallback } from "react";
import { type CalculateSPResult, type CalculateParameters } from "@/types/food"; // Adjust the import path as needed
import { WorkerController } from "@/modules/WorkerController";
import { useFoodStore } from "@/store/useFoodStore";

export function useSpWorker() {
  const [isCalculating, setIsCalculating] = useState(false);
  const { selectedFoods, setCalculationResults } = useFoodStore();
  const [result, setResult] = useState<CalculateSPResult | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [workerController, setWorkerController] =
    useState<WorkerController | null>(null);

  useEffect(() => {
    if (window && typeof window !== "undefined" && !workerController) {
      void import("@/workers/hillcalculator.worker").then(() => {
        const worker = new Worker(
          new URL("@/workers/hillcalculator.worker", import.meta.url),
        );
        const controller = new WorkerController(worker);
        setWorkerController(controller);
      });
    }
  }, [workerController]);

  useEffect(() => {
    if (workerController) {
      workerController.on("done", () => {
        setIsCalculating(false);
      });
      workerController.on("best_menus_update", (result: CalculateSPResult) => {
        setResult(result);
        setCalculationResults(result);
      });

      workerController.on("calculation_end", () => {
        setIsCalculating(false);
      });
    }

    return () => {
      if (workerController) {
        // Clean up the event listeners
        workerController.stop();
      }
    };
  }, [workerController, setCalculationResults]);

  const startCalculation = useCallback(
    (calculationParameters: Partial<CalculateParameters> = {}) => {
      if (!workerController) {
        if (window && typeof window !== "undefined") {
          void import("@/workers/hillcalculator.worker").then(() => {
            const worker = new Worker(
              new URL("@/workers/hillcalculator.worker", import.meta.url),
            );
            const controller = new WorkerController(worker);
            setWorkerController(controller);
          });
        }
        return;
      }

      if (selectedFoods.length === 0) {
        setError("No foods selected");
      }

      setIsCalculating(true);

      const defaultCalcParams: CalculateParameters = {
        selectedFoods,
        stomachFoods: [], // Add stomach foods if needed
        taste: new Map(), // Add taste preferences if needed
        menuSize: 5, // Set an appropriate menu size
        calculateType: "default", // Set the appropriate calculate type
      };

      // replace the calculation parameters with the default calculation parameters
      const calcParams = {
        ...defaultCalcParams,
        ...Object.fromEntries(
          Object.entries(calculationParameters).filter(
            ([_, value]) => value !== undefined,
          ),
        ),
      };

      workerController.start(calcParams);
    },
    [workerController, selectedFoods],
  );
  return {
    isCalculating,
    startCalculation,
    result,
    selectedFoods,
    error,
  };
}
