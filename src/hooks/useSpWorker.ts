// src/utils/useSpWorker.ts

import { useState, useEffect, useCallback } from "react";
import { type CalculateSPResult, type CalculateParameters } from "@/types/food"; // Adjust the import path as needed
import { WorkerController } from "@/modules/WorkerController";
import { useFoodStore } from "@/store/useFoodStore";
import { useServerStore } from "@/store/useServerStore";

export function useSpWorker({ shopName }: { shopName?: string } = {}) {
  const [isCalculating, setIsCalculating] = useState(false);
  const { selectedFoods, setCalculationResults } = useFoodStore();
  const { getServerTastePref, getShopResult, setServerCalculationResult } =
    useServerStore();
  const [result, setResult] = useState<
    CalculateSPResult | "loading" | undefined
  >("loading");

  const [error, setError] = useState<string | null>(null);
  const [workerController, setWorkerController] =
    useState<WorkerController | null>(null);

  useEffect(() => {
    if (shopName) {
      const shopResult = getShopResult(shopName);
      if (shopResult) {
        setResult(shopResult);

        return;
      } else {
        setResult(shopResult);
      }
    }
    if (window && typeof window !== "undefined" && !workerController) {
      void import("@/workers/hillcalculator.worker").then(() => {
        const worker = new Worker(
          new URL("@/workers/hillcalculator.worker", import.meta.url),
        );
        const controller = new WorkerController(worker);
        setWorkerController(controller);
      });
    }
  }, [getShopResult, shopName, workerController]);

  useEffect(() => {
    if (workerController) {
      workerController.on("done", () => {
        setIsCalculating(false);
      });
      workerController.on("best_menus_update", (result: CalculateSPResult) => {
        setResult(result);
        if (shopName) {
          setServerCalculationResult(shopName, result);
        } else {
          setCalculationResults(result);
        }

        // Update the server calculation results
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
  }, [
    setCalculationResults,
    setServerCalculationResult,
    shopName,
    workerController,
  ]);

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

      setIsCalculating(true);

      const defaultCalcParams: CalculateParameters = {
        selectedFoods,
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
        taste: new Map(Object.entries(getServerTastePref())),
      };

      workerController.start(calcParams);
    },
    [workerController, selectedFoods, getServerTastePref],
  );
  return {
    isCalculating,
    startCalculation,
    result,
    selectedFoods,
    error,
  };
}
