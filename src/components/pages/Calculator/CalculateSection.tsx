import React from "react";
import { BarChart } from "lucide-react";
import ResultRenderer from "@/components/ResultRenderer";
import { useSpWorker } from "@/hooks/useSpWorker";

const CalculateSection: React.FC = () => {
  const { isCalculating, startCalculation, selectedFoods, result } =
    useSpWorker();

  return (
    <div className="flex flex-col gap-3 p-4">
      <button
        onClick={() => startCalculation()}
        disabled={selectedFoods.length === 0 || isCalculating}
        className={`
        h-14 w-full flex-shrink-0 font-[Cubano] text-2xl ring-inset transition-all duration-100
        flex items-center justify-center gap-2
        ${
          isCalculating || selectedFoods.length === 0
            ? "bg-ecogreen-400/20 shadow-none ring-2 ring-ecogreen-400/20 cursor-not-allowed"
            : "bg-ecogreen-500/80 shadow-[0_0px_15px_-3px] shadow-ecogreen-400 ring-2 ring-ecogreen-400/80 hover:bg-ecogreen-600/80"
        }
      `}
      >
        {isCalculating ? (
          "Calculating..."
        ) : (
          <>
            <BarChart size={22} /> Calculate
          </>
        )}
      </button>

      {result && result !== "loading" && result.foods?.menu?.length > 0 && (
        <ResultRenderer result={result} shopName="" />
      )}
    </div>
  );
};

export default CalculateSection;
