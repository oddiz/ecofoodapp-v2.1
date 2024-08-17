import { type Food, type CalculateSPResult } from "@/types/food"; // Adjust the import path as needed

self.onmessage = (
  event: MessageEvent<{
    availableFoods: Food[];
    maxIterations: number;
    stomach: Food[];
    taste: Map<string, number>;
  }>,
) => {
  const { availableFoods, maxIterations } = event.data;
  const result = findBestMenuUsingHillMethod(
    availableFoods,
    maxIterations,
    event.data.stomach,
    event.data.taste,
  );
  self.postMessage(result);
};

function findBestMenuUsingHillMethod(
  availableFoods: Food[],
  maxIterations: number,
  stomach: Food[],
  taste: Map<string, number>,
): CalculateSPResult {
  let bestResult: CalculateSPResult | null = null;

  for (let i = 0; i < maxIterations; i++) {
    let currentMenu = generateRandomMenu(availableFoods);
    let currentResult = calculateSP(currentMenu, stomach, taste);

    let improved = true;
    while (improved) {
      improved = false;
      for (const food of availableFoods) {
        // Try adding a food
        if (currentMenu.length < 10) {
          const newMenu = [...currentMenu, food];
          const newResult = calculateSP(newMenu, stomach, taste);
          if (newResult.sp > currentResult.sp) {
            currentMenu = newMenu;
            currentResult = newResult;
            improved = true;
          }
        }

        // Try removing a food
        if (currentMenu.length > 1) {
          for (let j = 0; j < currentMenu.length; j++) {
            const newMenu = [
              ...currentMenu.slice(0, j),
              ...currentMenu.slice(j + 1),
            ];
            const newResult = calculateSP(newMenu, stomach, taste);
            if (newResult.sp > currentResult.sp) {
              currentMenu = newMenu;
              currentResult = newResult;
              improved = true;
            }
          }
        }

        // Try replacing a food
        for (let j = 0; j < currentMenu.length; j++) {
          const newMenu = [
            ...currentMenu.slice(0, j),
            food,
            ...currentMenu.slice(j + 1),
          ];
          const newResult = calculateSP(newMenu, stomach, taste);
          if (newResult.sp > currentResult.sp) {
            currentMenu = newMenu;
            currentResult = newResult;
            improved = true;
          }
        }
      }
    }

    if (!bestResult || currentResult.sp > bestResult.sp) {
      bestResult = currentResult;
    }
  }

  return bestResult!;
}

function generateRandomMenu(availableFoods: Food[]): Food[] {
  const menuSize = Math.floor(Math.random() * 10) + 1; // Random size between 1 and 10
  const menu: Food[] = [];
  for (let i = 0; i < menuSize; i++) {
    const randomIndex = Math.floor(Math.random() * availableFoods.length);
    menu.push(availableFoods[randomIndex]!);
  }
  return menu;
}

function calculateSP(
  menu: Food[],
  stomach: Food[],
  taste: Map<string, number>,
): CalculateSPResult {
  //accepts an array of food objects

  function calculateTasteMult() {
    const totalCal = menu.reduce((total, food) => total + food.cal, 0);

    let calWeightedTaste = 0;

    for (const food of menu) {
      calWeightedTaste =
        calWeightedTaste + (taste.get(food.id.toString()) ?? 1) * food.cal;
    }

    return calWeightedTaste / totalCal;
  }

  const tasteMultiplier = calculateTasteMult() || 1;
  const BASE_SP_GAIN = 12;
  const totals = menu.reduce(
    (total, food) => {
      total.carb += food.carb;
      total.fat += food.fat;
      total.vit += food.vit;
      total.pro += food.pro;
      total.cal += food.cal;
      total.price += food.price;
      return total;
    },
    { cal: 0, carb: 0, pro: 0, vit: 0, fat: 0, price: 0 },
  );

  const totalNutrients = totals.carb + totals.pro + totals.fat + totals.vit;
  const totalAverage = totalNutrients / totals.cal;

  const maxTotal = Math.max(totals.carb, totals.pro, totals.fat, totals.vit);
  const balancedMultiplier = (totalNutrients / (maxTotal * 4)) * 2;

  return {
    sp: BASE_SP_GAIN + totalAverage * balancedMultiplier * tasteMultiplier,
    foods: {
      menu: menu,
      stomach: stomach,
    },
    multipliers: {
      balanced: balancedMultiplier,
      taste: tasteMultiplier,
    },
    totals: totals,
  };
}
