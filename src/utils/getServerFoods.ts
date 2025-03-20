import type { AllItemsAPI, Item } from "@/types/allitems";
import type { Food } from "@/types/food";
import { generateApiEndpoints } from "@/utils/generateApiEndpoints";
import { isProperFood } from "@/utils/isProperFood";

export async function getFoodsFromAPI(serverIp: string): Promise<Food[]> {
  const response = await fetch(generateApiEndpoints(serverIp).allItems);
  if (!response.ok) {
    throw new Error("Failed to fetch server foods");
  }

  const { AllItems } = (await response.json()) as AllItemsAPI;
  const foodItems: Item[] = Object.values(AllItems).filter((item) =>
    isProperFood(item),
  );
  const foods: Food[] = foodItems.map(({ PropertyInfos }) => {
    const name = PropertyInfos.DisplayName.LocString;
    if (name === "Fruit Salad") {
      console.log(PropertyInfos);
    }
    const nutrients = parseNutrients(PropertyInfos.Nutrition!.Nutrients);

    const carb = nutrients.carbs ?? 0;
    const pro = nutrients.protein ?? 0;
    const fat = nutrients.fat ?? 0;
    const vit = nutrients.vitamins ?? 0;

    const totalNutrients = carb + pro + fat + vit;
    const tier = determineTier(totalNutrients);

    const type = determineType(tier);

    return {
      id: Number(PropertyInfos.TypeID.Int32),
      name,
      type,
      tier,
      cal: Number(PropertyInfos.Calories?.Single) ?? 0,
      carb,
      pro,
      fat,
      vit,
      weight: Number(PropertyInfos.Weight.Int32),
    };
  });

  // check if there is any duplicate foods
  const uniqueFoods = foods.filter(
    (food, index, self) => self.findIndex((f) => f.id === food.id) === index,
  );

  return uniqueFoods;
}

/**
"- <color=#F54F12FF>Carbs: <mspace=0.5em><pos=4.0em>  15.0</pos></mspace></color>
- <color=#FFAE00FF>Protein: <mspace=0.5em><pos=4.0em>   2.0</pos></mspace></color>
- <color=#FFD21AFF>Fat: <mspace=0.5em><pos=4.0em>  17.0</pos></mspace></color>
- <color=#A7D20FFF>Vitamins: <mspace=0.5em><pos=4.0em>   2.0</pos></mspace></color>"

"- <color=#F54F12FF>Carbs: <mspace=0.5em><pos=4.0em>   1,0</pos></mspace></color>\n- <color=#FFAE00FF>Protein: <mspace=0.5em><pos=4.0em>   4,0</pos></mspace></color>\n- <color=#FFD21AFF>Fat: <mspace=0.5em><pos=4.0em>   3,0</pos></mspace></color>"
 */
// Define the shape of our parsed nutrients
interface Nutrients {
  carbs?: number;
  protein?: number;
  fat?: number;
  vitamins?: number;
}

export function parseNutrients(inputText: string): Nutrients {
  const results: Nutrients = {};

  const lines = inputText.split(/\r?\n/);

  lines.forEach((line) => {
    // Look for the nutrient name, then capture everything after the colon
    const match = line.match(/(Carbs|Protein|Fat|Vitamins)\s*:\s*(.*)/i);
    if (match) {
      const nutrientName = (match[1]?.toLowerCase() as keyof Nutrients) ?? "";
      // match[2] is everything after "Carbs: " (or "Protein: ", etc.)

      // Replace commas with periods
      const normalizedText = match[2]?.replace(/,/g, ".") ?? "";

      // Extract *all* numbers from that piece of text
      const allNumbers = normalizedText.match(/\d+(\.\d+)?/g) ?? 0;
      if (allNumbers && allNumbers.length > 0) {
        // The last number should be the actual nutrient value (e.g. 15.0),
        // ignoring any earlier ones (like 0.5 in "mspace=0.5em").
        const lastNumber = allNumbers[allNumbers.length - 1];
        results[nutrientName] = parseFloat(lastNumber ?? "0");
      }
    }
  });

  return results;
}

// Determine tiers
/**
based on total nutrients 
Tier 4: 46-65 Kitchen - Stove
Tier 3: 28-45 Cast Iron Stove - Bakery
Tier 2: 24-28 Campfire
Tier 1: 11-15 Campfire Charred
Tier 0: Raw Food tag
 */
export function determineTier(totalNutrients: number): number {
  if (totalNutrients >= 46) {
    return 4;
  }
  if (totalNutrients >= 28 && totalNutrients <= 45) {
    return 3;
  }
  if (totalNutrients >= 24 && totalNutrients <= 28) {
    return 2;
  }
  if (totalNutrients >= 11 && totalNutrients <= 15) {
    return 1;
  }
  return 0;
}

function determineType(tier: number) {
  switch (tier) {
    case 4:
      return "Kitchen/Stove++";
    case 3:
      return "Cast Iron Stove/Bakery";
    case 2:
      return "Campfire";
    case 1:
      return "Campfire Charred";
    case 0:
      return "Raw Food";
  }
  return "Unknown";
}
