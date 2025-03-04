import type { FoodShop } from "@/types/shops";
import { generateApiEndpoints } from "@/utils/generateApiEndpoints";

interface MapData {
  Plots: Record<string, { x: number; y: number }[]>;
}

export async function parseStoreCoordinates(
  serverIp: string,
  shops: FoodShop[],
): Promise<{ updatedShops: FoodShop[]; notFoundShops: string[] }> {
  try {
    const endpoints = generateApiEndpoints(serverIp);
    const response = await fetch(endpoints.mapInfo);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const mapData = (await response.json()) as MapData;

    // Filter out plots without coordinates
    const validPlots = Object.entries(mapData.Plots).reduce(
      (acc, [key, coords]) => {
        if (coords.length > 0) {
          acc[key] = coords;
        }
        return acc;
      },
      {} as Record<string, { x: number; y: number }[]>,
    );

    const updatedShops: FoodShop[] = [];
    const notFoundShops: string[] = [];

    shops.forEach((shop) => {
      if (shop.owner) {
        const owner = shop.owner; // Create a non-null reference
        // First, try to find "homestead of ..."
        let plotKey = Object.keys(validPlots).find((key) =>
          key.toLowerCase().includes(`homestead of ${owner.toLowerCase()}`),
        );

        // If not found, look for any plot involving the owner's name
        if (!plotKey) {
          const ownerPlots = Object.keys(validPlots).filter((key) =>
            key.toLowerCase().includes(owner.toLowerCase()),
          );

          // If there's exactly one plot with the owner's name, use it
          if (ownerPlots.length === 1) {
            plotKey = ownerPlots[0];
          }
        }

        if (plotKey) {
          const coordinates = validPlots[plotKey];
          if (coordinates && coordinates.length > 1) {
            const avgX = Math.round(
              coordinates.reduce((sum, coord) => sum + coord.x, 0) /
                coordinates.length,
            );
            const avgY = Math.round(
              coordinates.reduce((sum, coord) => sum + coord.y, 0) /
                coordinates.length,
            );
            updatedShops.push({
              ...shop,
              coordinates: [avgX, avgY], // We don't have z-coordinate, so defaulting to 0
            });
          }
        } else {
          notFoundShops.push(shop.name);
        }
      } else {
        notFoundShops.push(shop.name);
      }
    });

    console.log("Shops not found:", notFoundShops);

    return { updatedShops, notFoundShops };
  } catch (error) {
    console.error("Error parsing store coordinates:", error);
    return {
      updatedShops: shops,
      notFoundShops: shops.map((shop) => shop.name),
    };
  }
}
