import React, { useEffect } from "react";
import type { FoodShop } from "@/types/shops";
import ResultRenderer from "@/components/ResultRenderer";
import { useSpWorker } from "@/hooks/useSpWorker";
import { toast } from "sonner";

interface ShopCardProps {
  shop: FoodShop;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  const { startCalculation, isCalculating, error, result } = useSpWorker();

  function doShopCalculation() {
    startCalculation({ selectedFoods: shop.foodsForSale });
  }
  useEffect(() => {
    if (error) {
      toast(error);
    }
    if (shop) {
      startCalculation({ selectedFoods: shop.foodsForSale });
    }
  }, [error, shop, startCalculation]);

  return (
    <div
      className={
        (result ? "row-span-1 " : "") +
        `flex flex-col w-full rounded-lg bg-primarydark-800 border border-primarydark-400/40 shadow-lg`
      }
    >
      {/* Header Section */}
      <div className="flex h-20 w-full flex-none">
        <div className="flex flex-col flex-1 p-3  border-b border-primarydark-400/40 ">
          <p className="text-xs font-bold text-primary-100">{shop.name}</p>
          <p className="text-primary-400 text-xs mt-auto justify-self-end">
            {shop.owner}
          </p>
        </div>
        <button
          onClick={doShopCalculation}
          disabled={isCalculating}
          className={`w-20 h-full text-sm  rounded-tr-lg font-semibold transition-all duration-200 text-slate-100/80 overflow-hidden
            ${
              isCalculating
                ? "bg-ecogreen-400/20 text-primary-400 cursor-not-allowed"
                : "bg-ecogreen-600/40 text-primary-100 hover:bg-ecogreen-500/40 shadow-[0_0px_15px_-3px] shadow-ecogreen-400/40"
            }
          `}
        >
          {isCalculating ? "Calculating..." : "Calculate"}
        </button>
      </div>

      {/* Items / Calculate Section */}
      {result ? (
        <ResultRenderer result={result} shopName={shop.name} />
      ) : (
        <div className="p-3 border-b h-72 overflow-y-auto  overflow-x-hidden border-primarydark-400/40">
          <h3 className="text-md font-semibold text-primary-200 mb-4">
            Available Foods
          </h3>
          <div className="grid grid-cols-2 grid-rows-2 gap-2 ">
            {shop.foodsForSale.map((food) => (
              <div
                key={food.id + shop.name}
                className="flex text-xs justify-between items-center p-1 rounded-md bg-primarydark-700/50 border border-primarydark-400/20"
              >
                <span className="text-primary-300 ">{food.name}</span>
                <span className="text-ecogreen-400">
                  ${shop.prices?.[food.name]?.toFixed(2) ?? "N/A"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calculate Section */}
      {error && (
        <div className="mt-4 p-3 rounded-md bg-red-500/20 border border-red-500/40 text-red-400">
          {error}
        </div>
      )}

      {/* Results Section */}
    </div>
  );
};

export default ShopCard;
