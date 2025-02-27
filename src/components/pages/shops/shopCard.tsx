import React, { useEffect, useState } from "react";
import type { FoodShop } from "@/types/shops";
import ResultRenderer from "@/components/ResultRenderer";
import { useSpWorker } from "@/hooks/useSpWorker";
import { toast } from "sonner";
import { ShopNameColorParser } from "@/components/ShopName";
import { Ban, Eye, EyeOff } from "lucide-react";

interface ShopCardProps {
  shop: FoodShop;
  onBlacklist?: (shopName: string) => void;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop, onBlacklist }) => {
  const { startCalculation, error, result } = useSpWorker({
    shopName: shop.name,
  });
  const [showCalcResult, setShowCalcResult] = useState<boolean>(true);

  useEffect(() => {
    if (error) {
      toast(error);
    }
    if (shop && !result) {
      startCalculation({ selectedFoods: shop.foodsForSale });
    }
  }, [error, result, shop, startCalculation]);

  return (
    <div
      className={
        (result ? "row-span-1 " : "") +
        `flex flex-col w-full rounded-lg bg-primarydark-800 border border-primarydark-400/40 shadow-lg`
      }
    >
      {/* Header Section */}
      <div className="flex h-20 w-full flex-none">
        <div className="flex flex-col flex-1 p-3 border-b border-primarydark-400/40">
          <div className="flex justify-between items-start">
            <ShopNameColorParser name={shop.name} />
            <div className="flex gap-1">
              {/* Toggle calc result visibility button */}
              {result && (
                <button
                  onClick={() => setShowCalcResult(!showCalcResult)}
                  className="p-1 rounded-full hover:bg-primarydark-700 transition-colors"
                >
                  {showCalcResult ? (
                    <EyeOff className="h-3.5 w-3.5 text-primary-400" />
                  ) : (
                    <Eye className="h-3.5 w-3.5 text-primary-400" />
                  )}
                </button>
              )}

              {/* Blacklist button */}
              {onBlacklist && (
                <button
                  onClick={() => onBlacklist(shop.name)}
                  className="p-1 rounded-full hover:bg-primarydark-700 transition-colors"
                >
                  <Ban className="h-3.5 w-3.5 text-ecored-500" />
                </button>
              )}
            </div>
          </div>
          <p className="text-primary-400 text-xs mt-auto justify-self-end">
            {shop.owner}
          </p>
        </div>
      </div>

      {/* Items / Calculate Section */}
      {result && result !== "loading" && showCalcResult ? (
        <ResultRenderer result={result} shopName={shop.name} />
      ) : (
        <div className="p-3 border-b h-72 overflow-y-auto overflow-x-hidden border-primarydark-400/40">
          <h3 className="text-md font-semibold text-primary-200 mb-4">
            Available Foods
          </h3>
          <div className="grid grid-cols-2 grid-rows-2 gap-2">
            {shop.foodsForSale.map((food) => (
              <div
                key={food.id + shop.name}
                className="flex text-xs justify-between items-center p-1 rounded-md bg-primarydark-700/50 border border-primarydark-400/20"
              >
                <span className="text-primary-300">{food.name}</span>
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
    </div>
  );
};

export default ShopCard;
