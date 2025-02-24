import React from "react";

import { useSpWorker } from "@/utils/useSpWorker";
import { toast } from "sonner";

export const CalculateButton: React.FC = () => {
  const { isCalculating, startCalculation, selectedFoods, error } =
    useSpWorker();

  if (error) {
    toast(error);
  }

  return (
    <button
      onClick={startCalculation}
      disabled={selectedFoods.length === 0 || isCalculating}
      className={`
        h-14 w-full flex-shrink-0 font-[Cubano] text-2xl ring-inset transition-all duration-100
        ${
          isCalculating || selectedFoods.length === 0
            ? "bg-ecogreen-400/20 shadow-none ring-2 ring-ecogreen-400/20 cursor-not-allowed"
            : "bg-ecogreen-500/80 shadow-[0_0px_15px_-3px] shadow-ecogreen-400 ring-2 ring-ecogreen-400/80 hover:bg-ecogreen-600/80"
        }
      `}
    >
      {isCalculating ? "Calculating..." : "Calculate"}
    </button>
  );
};
