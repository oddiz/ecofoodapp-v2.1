import type { Food } from "@/types/food";
import type { EcoShop, FoodShop, ShopsAPI } from "@/types/shops";
import { generateApiEndpoints } from "@/utils/generateApiEndpoints";

export async function getFoodShopsFromAPI(
  serverIp: string,
  serverFoods: Food[],
) {
  const response = await fetch(generateApiEndpoints(serverIp).stores);
  if (!response.ok) {
    throw new Error("Failed to fetch server foods");
  }

  const { Stores } = (await response.json()) as ShopsAPI;

  const foodShops = Stores.filter((store) => isFoodShop(store, serverFoods));

  const parsedFoodShops: FoodShop[] = foodShops.map((store) => {
    // First, get all non-buying offers with their quantities
    const foodOffersWithQuantity = store.AllOffers.filter(
      (offer) => !offer.Buying && offer.Quantity > 0,
    );

    // Then map to the actual food objects
    const foodsForSale = foodOffersWithQuantity
      .map((offer) => serverFoods.find((food) => food.name === offer.ItemName))
      .filter((food) => food !== undefined);

    // delete duplicate foods in same store
    const uniqueFoods = foodsForSale.filter(
      (food, index, self) =>
        self.findIndex((f) => f?.name === food?.name) === index,
    );

    const prices = foodsForSale.reduce(
      (acc, offer) => {
        acc[offer.name] = store.AllOffers.find(
          (storeOffer) => storeOffer.ItemName === offer.name,
        )!.Price;
        return acc;
      },
      {} as Record<Food["name"], number>,
    );

    const quantities = foodsForSale.reduce(
      (acc, offer) => {
        const storeOffer = store.AllOffers.find(
          (storeOffer) => storeOffer.ItemName === offer.name,
        )!;
        acc[offer.name] = storeOffer.Quantity;
        return acc;
      },
      {} as Record<Food["name"], number>,
    );

    return {
      foodsForSale: uniqueFoods,
      name: store.Name,
      owner: store.Owner,
      prices,
      quantities,
    };
  });
  // Filter out shops with duplicate names by keeping only the first occurrence
  const uniqueShopsWithFood = parsedFoodShops
    .filter(
      (shop, index, self) =>
        self.findIndex((s) => s.name === shop.name) === index,
    )
    .filter((shop) => shop.foodsForSale.length > 0);
  return uniqueShopsWithFood;
}

/**
"- <color=#F54F12FF>Carbs: <mspace=0.5em><pos=4.0em>  15.0</pos></mspace></color>
- <color=#FFAE00FF>Protein: <mspace=0.5em><pos=4.0em>   2.0</pos></mspace></color>
- <color=#FFD21AFF>Fat: <mspace=0.5em><pos=4.0em>  17.0</pos></mspace></color>
- <color=#A7D20FFF>Vitamins: <mspace=0.5em><pos=4.0em>   2.0</pos></mspace></color>"

 */
// Define the shape of our parsed nutrients

function isFoodShop(store: EcoShop, serverFoods: Food[]): boolean {
  // must be enabled
  // must have food for sale

  return (
    (store.Enabled &&
      store.AllOffers.some(
        (offer) =>
          !offer.Buying &&
          serverFoods.some((food) => food.name === offer.ItemName),
      )) ||
    false
  );
}
