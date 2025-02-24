import {
  type Food,
  type CalculateSPResult,
  type StartWorkerMessage,
} from "@/types/food";

const MAX_ITERATIONS = 20000;
self.onmessage = (event: MessageEvent<StartWorkerMessage>) => {
  const { selectedFoods, stomachFoods, taste, calculateType, menuSize } =
    event.data;
  if (
    event.data.source === "calculator" &&
    event.data.message === "start_worker"
  ) {
    console.log("Worker received start message", event.data);
    findBestMenuUsingHillMethod(
      selectedFoods,
      stomachFoods,
      taste,
      calculateType,
      menuSize,
    );
  }
};

function findBestMenuUsingHillMethod(
  selectedFoods: Food[],
  stomach: Food[],
  taste: Map<string, number>,
  calculateType: "default" | "random",
  menuSize: number,
): void {
  let bestResult: CalculateSPResult | null = null;

  if (selectedFoods.length === 0) {
    self.postMessage({ op: "calculation_end" });
    return;
  }
  if (calculateType !== "default") {
    self.postMessage({ op: "calculation_end" });
    return;
  }

  if (menuSize < 1 || menuSize > 10) {
    self.postMessage({ op: "calculation_end" });
    return;
  }

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    let currentMenu = generateRandomMenu(selectedFoods);
    let currentResult = calculateSP(currentMenu, stomach, taste);

    let improved = true;
    while (improved) {
      improved = false;
      for (const food of selectedFoods) {
        if (tryAddFood(food, currentMenu, currentResult, stomach, taste)) {
          improved = true;
          currentMenu = [...currentMenu];
          currentResult = calculateSP(currentMenu, stomach, taste);
        }
        if (tryRemoveFood(currentMenu, currentResult, stomach, taste)) {
          improved = true;
          currentMenu = [...currentMenu];
          currentResult = calculateSP(currentMenu, stomach, taste);
        }
        if (tryReplaceFood(food, currentMenu, currentResult, stomach, taste)) {
          improved = true;
          currentMenu = [...currentMenu];
          currentResult = calculateSP(currentMenu, stomach, taste);
        }
      }
    }

    if (!bestResult || currentResult.sp > bestResult.sp) {
      bestResult = currentResult;
    }
  }

  // Send final result
  self.postMessage({ op: "best_menus_update", result: bestResult });
  self.postMessage({ op: "calculation_end" });
}

function tryAddFood(
  food: Food,
  currentMenu: Food[],
  currentResult: CalculateSPResult,
  stomach: Food[],
  taste: Map<string, number>,
): boolean {
  if (currentMenu.length < 10) {
    const newMenu = [...currentMenu, food];
    const newResult = calculateSP(newMenu, stomach, taste);
    if (newResult.sp > currentResult.sp) {
      currentMenu.push(food);
      Object.assign(currentResult, newResult);
      return true;
    }
  }
  return false;
}

function tryRemoveFood(
  currentMenu: Food[],
  currentResult: CalculateSPResult,
  stomach: Food[],
  taste: Map<string, number>,
): boolean {
  if (currentMenu.length > 1) {
    for (let j = 0; j < currentMenu.length; j++) {
      const newMenu = [...currentMenu.slice(0, j), ...currentMenu.slice(j + 1)];
      const newResult = calculateSP(newMenu, stomach, taste);
      if (newResult.sp > currentResult.sp) {
        currentMenu.splice(j, 1);
        Object.assign(currentResult, newResult);
        return true;
      }
    }
  }
  return false;
}

function tryReplaceFood(
  food: Food,
  currentMenu: Food[],
  currentResult: CalculateSPResult,
  stomach: Food[],
  taste: Map<string, number>,
): boolean {
  for (let j = 0; j < currentMenu.length; j++) {
    const newMenu = [
      ...currentMenu.slice(0, j),
      food,
      ...currentMenu.slice(j + 1),
    ];
    const newResult = calculateSP(newMenu, stomach, taste);
    if (newResult.sp > currentResult.sp) {
      currentMenu[j] = food;
      Object.assign(currentResult, newResult);
      return true;
    }
  }
  return false;
}

function generateRandomMenu(availableFoods: Food[]): Food[] {
  const menuSize = Math.floor(Math.random() * 10) + 1; // Random size between 1 and 10
  return Array.from(
    { length: menuSize },
    () => availableFoods[Math.floor(Math.random() * availableFoods.length)]!,
  );
}

function calculateSP(
  menu: Food[],
  stomach: Food[],
  taste: Map<string, number>,
): CalculateSPResult {
  const sanitizedMenu = menu.map((food) => ({
    ...food,
    cal: food.cal || 1,
  }));

  // Calculate total calories in one pass
  const totalCalories = sanitizedMenu.reduce((sum, food) => sum + food.cal, 0);

  // Calculate the "tasteMultiplier" based on weighted tasteMult
  const tasteMultiplier = calculateTasteMult(menu, totalCalories, taste) || 1;
  // Prepare variables for sums
  let totalCarbSum = 0;
  let totalProteinSum = 0;
  let totalFatSum = 0;
  let totalVitaminSum = 0;

  // Loop once to gather all nutrient totals and build the food list
  for (const food of sanitizedMenu) {
    totalCarbSum += food.cal * food.carb;
    totalProteinSum += food.cal * food.pro;
    totalFatSum += food.cal * food.fat;
    totalVitaminSum += food.cal * food.vit;
  }

  // Combine nutrient sums into a total nutrition measure
  const totalNutrition =
    totalCarbSum + totalProteinSum + totalFatSum + totalVitaminSum;

  // Average nutrient density per calorie
  const averageNutrition = totalNutrition / totalCalories;

  // Identify the largest contributor among carb/pro/fat/vit
  const maxNutrition = Math.max(
    totalCarbSum,
    totalProteinSum,
    totalFatSum,
    totalVitaminSum,
  );

  // Balanced factor = how evenly distributed the nutrients are
  const balancedFactor = (totalNutrition / (maxNutrition * 4)) * 2;

  // Base gain is a constant
  const baseGain = 12;

  // Final SP calculation
  const sp = baseGain + averageNutrition * balancedFactor * tasteMultiplier;
  return {
    sp,
    foods: { menu, stomach },
    multipliers: { balanced: balancedFactor, taste: tasteMultiplier },
    totals: {
      cal: totalCalories,
      carb: totalCarbSum,
      pro: totalProteinSum,
      fat: totalFatSum,
      vit: totalVitaminSum,
      price: 0,
    },
  };
}

function calculateTasteMult(
  menu: Food[],
  totalCal: number,
  taste: Map<string, number>,
): number {
  return (
    menu.reduce(
      (acc, food) => acc + (taste.get(food.id.toString()) ?? 1) * food.cal,
      0,
    ) / totalCal
  );
}
