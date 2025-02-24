import type { CalculateSPResult, Food } from "@/types/food";

export function calculateSP(
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
