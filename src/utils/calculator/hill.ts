import type { CalculateSPResult, Food } from "@/types/food";
import { calculateSP } from "@/utils/calculator/calculateSp";

export function findBestMenuUsingHillMethod(
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
