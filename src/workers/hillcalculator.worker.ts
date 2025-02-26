import {
  type Food,
  type CalculateSPResult,
  type StartWorkerMessage,
} from "@/types/food";
const TASTE_MULTS = {
  "-3": 0.7,
  "-2": 0.8,
  "-1": 0.9,
  "0": 1,
  "1": 1.1,
  "2": 1.2,
  "3": 1.3,
};
//calculation_time: 5256.2939453125 ms
// sp:131.8
const MAX_ITERATIONS = 20000;
// Threshold for early stopping - if no improvement after this many iterations
const EARLY_STOP_THRESHOLD = 3000;
const EMPTY_RESULT: CalculateSPResult = {
  sp: -Infinity,
  foods: { menu: [] },
  multipliers: { balanced: 0, taste: 0 },
  totals: { cal: 0, carb: 0, pro: 0, vit: 0, fat: 0, price: 0 },
};
self.onmessage = (event: MessageEvent<StartWorkerMessage>) => {
  const { selectedFoods, taste, calculateType, menuSize } = event.data;
  if (
    event.data.source === "calculator" &&
    event.data.message === "start_worker"
  ) {
    console.time("calculation_time");
    findBestMenuUsingHillMethod(selectedFoods, taste, calculateType, menuSize);
  }
};

function findBestMenuUsingHillMethod(
  selectedFoods: Food[],
  taste: Map<string, number>,
  calculateType: "default" | "random",
  menuSize: number,
): void {
  // Pre-check conditions
  if (
    selectedFoods.length === 0 ||
    calculateType !== "default" ||
    menuSize < 1 ||
    menuSize > 10
  ) {
    self.postMessage({ op: "calculation_end" });
    return;
  }

  let bestResult: CalculateSPResult | null = null;
  let bestSP = -Infinity;
  let iterationsWithoutImprovement = 0;

  // Pre-compute taste values for faster lookup
  const tasteLookup = new Map<string, number>();
  selectedFoods.forEach((food) => {
    tasteLookup.set(food.name.toString(), taste.get(food.name.toString()) ?? 0);
  });

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    // Early stopping if no improvement for a while
    if (iterationsWithoutImprovement > EARLY_STOP_THRESHOLD) {
      break;
    }
    const currentMenu = generateRandomMenu(selectedFoods);
    const currentResult = calculateSPOptimized(currentMenu, tasteLookup);

    let improved = true;
    while (improved) {
      improved = false;

      // Try all improvement operations in a single pass
      const operations: Array<() => boolean> = [];
      // Build list of potential operations
      if (currentMenu.length < 10) {
        selectedFoods.forEach((food) => {
          operations.push(() =>
            tryAddFood(food, currentMenu, currentResult, tasteLookup),
          );
        });
      }

      if (currentMenu.length > 1) {
        operations.push(() =>
          tryRemoveFood(currentMenu, currentResult, tasteLookup),
        );
      }

      for (const food of selectedFoods) {
        operations.push(() =>
          tryReplaceFood(food, currentMenu, currentResult, tasteLookup),
        );
      }

      // Try all operations and stop after first improvement
      for (const operation of operations) {
        if (operation()) {
          improved = true;
          break;
        }
      }
    }

    // Update best result if improved
    if (currentResult.sp > bestSP) {
      bestSP = currentResult.sp;
      bestResult = currentResult;
      iterationsWithoutImprovement = 0;
    } else {
      iterationsWithoutImprovement++;
    }
  }

  // Send final result
  self.postMessage({ op: "best_menus_update", result: bestResult });
  self.postMessage({ op: "calculation_end" });

  console.timeEnd("calculation_time");
}

function tryAddFood(
  food: Food,
  currentMenu: Food[],
  currentResult: CalculateSPResult,
  tasteLookup: Map<string, number>,
): boolean {
  // Use direct array modification instead of creating new arrays
  currentMenu.push(food);
  const newResult = calculateSPOptimized(currentMenu, tasteLookup);

  if (newResult.sp > currentResult.sp) {
    // Keep the change and update the result
    Object.assign(currentResult, newResult);
    return true;
  } else {
    // Revert the change
    currentMenu.pop();
    return false;
  }
}

function tryRemoveFood(
  currentMenu: Food[],
  currentResult: CalculateSPResult,
  tasteLookup: Map<string, number>,
): boolean {
  // Try removing the food that contributes least to the score
  let bestRemovalIndex = -1;
  let bestRemovalScore = -Infinity;

  for (let j = 0; j < currentMenu.length; j++) {
    const removed = currentMenu.splice(j, 1)[0]!;
    const newResult = calculateSPOptimized(currentMenu, tasteLookup);

    if (newResult.sp > bestRemovalScore) {
      bestRemovalScore = newResult.sp;
      bestRemovalIndex = j;
    }

    // Restore the menu
    currentMenu.splice(j, 0, removed);
  }

  if (bestRemovalIndex >= 0 && bestRemovalScore > currentResult.sp) {
    // Perform the best removal
    currentMenu.splice(bestRemovalIndex, 1);
    Object.assign(
      currentResult,
      calculateSPOptimized(currentMenu, tasteLookup),
    );
    return true;
  }

  return false;
}

function tryReplaceFood(
  food: Food,
  currentMenu: Food[],
  currentResult: CalculateSPResult,
  tasteLookup: Map<string, number>,
): boolean {
  // Early exit if the menu already contains this food (no need to replace with same)
  if (currentMenu.some((item) => item.id === food.id)) {
    return false;
  }

  let bestReplaceIndex = -1;
  let bestReplaceScore = -Infinity;

  for (let j = 0; j < currentMenu.length; j++) {
    const original = currentMenu[j];
    currentMenu[j] = food;
    const newResult = calculateSPOptimized(currentMenu, tasteLookup);

    if (newResult.sp > bestReplaceScore) {
      bestReplaceScore = newResult.sp;
      bestReplaceIndex = j;
    }

    // Restore original
    currentMenu[j] = original!;
  }

  if (bestReplaceIndex >= 0 && bestReplaceScore > currentResult.sp) {
    currentMenu[bestReplaceIndex] = food;
    Object.assign(
      currentResult,
      calculateSPOptimized(currentMenu, tasteLookup),
    );
    return true;
  }

  return false;
}

function generateRandomMenu(
  availableFoods: Food[],
  targetSize?: number,
): Food[] {
  const size = targetSize ?? Math.floor(Math.random() * 10) + 1; // Random size between 1 and 10
  const menu: Food[] = [];
  const availableCount = availableFoods.length;

  // More efficient random selection
  for (let i = 0; i < size; i++) {
    menu.push(availableFoods[Math.floor(Math.random() * availableCount)]!);
  }

  return menu;
}
function calculateSPOptimized(
  menu: Food[],
  tasteLookup: Map<string, number>,
): CalculateSPResult {
  // Fast-path for empty menu
  if (menu.length === 0) {
    return EMPTY_RESULT;
  }

  // Single-pass calculation of all values
  let totalCalories = 0;
  let totalCarbSum = 0;
  let totalProteinSum = 0;
  let totalFatSum = 0;
  let totalVitaminSum = 0;
  let weightedTasteSum = 0;

  // Use for loop instead of for..of for better performance
  const menuLength = menu.length;
  for (let i = 0; i < menuLength; i++) {
    const food = menu[i]!;
    const cal = food?.cal ?? 1;
    totalCalories += cal;

    // Use multiplication by cal once per food
    const calFactor = cal;
    totalCarbSum += calFactor * food.carb;
    totalProteinSum += calFactor * food.pro;
    totalFatSum += calFactor * food.fat;
    totalVitaminSum += calFactor * food.vit;

    // Avoid toString() in hot loop by using numeric ID if available
    const tasteLevel = tasteLookup.get(food.name.toString()) ?? 0;
    const tasteValue: number =
      TASTE_MULTS[tasteLevel.toString() as keyof typeof TASTE_MULTS] ?? 1;
    weightedTasteSum += calFactor * tasteValue;
  }

  const invCalories = 1 / totalCalories;
  const tasteMultiplier = weightedTasteSum * invCalories;

  // Calculate total nutrition
  const totalNutrition =
    totalCarbSum + totalProteinSum + totalFatSum + totalVitaminSum;
  const averageNutrition = totalNutrition * invCalories;

  // Find max nutrition component with inline comparison for speed
  let maxNutrition = totalCarbSum;
  if (totalProteinSum > maxNutrition) maxNutrition = totalProteinSum;
  if (totalFatSum > maxNutrition) maxNutrition = totalFatSum;
  if (totalVitaminSum > maxNutrition) maxNutrition = totalVitaminSum;

  // Balance factor calculation with constant factor precalculated
  const BALANCE_FACTOR_MULTIPLIER = 0.5; // 2/4 simplified
  const balancedFactor =
    (totalNutrition / maxNutrition) * BALANCE_FACTOR_MULTIPLIER;

  // Final SP calculation with baseGain as constant
  const BASE_GAIN = 12;
  const sp = BASE_GAIN + averageNutrition * balancedFactor * tasteMultiplier;

  return {
    sp,
    foods: { menu },
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
