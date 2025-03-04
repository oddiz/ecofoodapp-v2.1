import React, { useState } from "react";
import { Store } from "lucide-react";
import type { BestDeal } from "@/pages/shopping-list";

interface MapDimensions {
  naturalWidth: number;
  naturalHeight: number;
  displayWidth: number;
  displayHeight: number;
}

interface ShopMarkerProps {
  deal: BestDeal;
  mapDimensions: MapDimensions;
}

const ShopMarker: React.FC<ShopMarkerProps> = ({ deal, mapDimensions }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  console.log(deal);
  if (deal.shop?.coordinates === undefined) return null;
  // Calculate position based on coordinates and map dimensions
  const positionX =
    (deal.shop.coordinates[0] / mapDimensions.naturalWidth) * 100;
  const positionY =
    (deal.shop.coordinates[1] / mapDimensions.naturalHeight) * 100;

  return (
    <div
      className="absolute"
      style={{
        left: `${positionX}%`,
        bottom: `${positionY}%`,
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="cursor-pointer text-ecogreen-500 bg-primarydark-800 rounded-full p-1">
        <Store className="h-6 w-6" />
      </div>

      {showTooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-primarydark-900 border border-primarydark-600 rounded-md p-2 shadow-lg z-10 min-w-40">
          <div className="font-semibold text-primary-100">
            {deal.shop.shopName}
          </div>
          <div className="text-xs text-primary-300">
            {deal.shop.shopQuantity} items available
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopMarker;
