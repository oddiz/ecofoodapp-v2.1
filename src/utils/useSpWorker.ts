// src/utils/useSpWorker.ts

import { useState, useCallback } from "react";
import { type Food, type CalculateSPResult } from "../types/food"; // Adjust the import path as needed

export function useSpWorker() {
  const [result, setResult] = useState<CalculateSPResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateBestMenu = useCallback(
    (availableFoods: Food[], maxIterations: number) => {
      setIsLoading(true);
      setError(null);

      const worker = new Worker(
        new URL("../workers/spWorker.ts", import.meta.url),
      );

      worker.onmessage = (event: MessageEvent) => {
        setResult(event.data as CalculateSPResult | null);
        setIsLoading(false);
        worker.terminate();
      };

      worker.onerror = (error) => {
        setError("An error occurred in the worker: " + error.message);
        setIsLoading(false);
        worker.terminate();
      };

      worker.postMessage({ availableFoods, maxIterations });
    },
    [],
  );

  return { calculateBestMenu, result, isLoading, error };
}
