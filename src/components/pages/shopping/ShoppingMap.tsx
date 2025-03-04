/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect } from "react";
import ShopMarker from "@/components/pages/shopping/ShopMarker";
import { generateApiEndpoints } from "@/utils/generateApiEndpoints";
import { useServerStore } from "@/store/useServerStore";
import type { BestDeal } from "@/pages/cart";

interface ShoppingMapProps {
  bestDeals: BestDeal[];
}

interface MapDimensions {
  naturalWidth: number;
  naturalHeight: number;
  displayWidth: number;
  displayHeight: number;
}

const ShoppingMap: React.FC<ShoppingMapProps> = ({ bestDeals }) => {
  const { currentServer } = useServerStore();
  const [mapDimensions, setMapDimensions] = useState<MapDimensions | null>(
    null,
  );
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapSrc = generateApiEndpoints(currentServer.address).mapGif;

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    setMapDimensions({
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      displayWidth: img.width,
      displayHeight: img.height,
    });

    console.log(img.naturalWidth, img.naturalHeight);
  };

  // Update dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (mapContainerRef.current && mapDimensions) {
        const { width, height } =
          mapContainerRef.current.getBoundingClientRect();
        setMapDimensions((prev) =>
          prev
            ? {
                ...prev,
                displayWidth: width,
                displayHeight: height,
              }
            : prev,
        );
      }
    };

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [mapDimensions]);

  return (
    <div className="relative bg-primarydark-700 rounded-lg border border-primarydark-500/40 shadow-md overflow-hidden">
      <div className="p-4 border-b border-primarydark-600">
        <h2 className="text-xl font-semibold text-primary-100">
          Store Locations
        </h2>
      </div>
      <div ref={mapContainerRef} className="relative">
        <img
          src={mapSrc}
          alt="Map"
          className="w-full h-auto"
          onLoad={handleImageLoad}
        />
        {mapDimensions &&
          bestDeals.map((deal, index) => (
            <ShopMarker key={index} deal={deal} mapDimensions={mapDimensions} />
          ))}
      </div>
    </div>
  );
};

export default ShoppingMap;
