type ICalculatorFilter = {
    maxBudget: number;
    maxCalories: number;
};

import { type Food } from "@/types/food";

export function menuValid(menu: Food[], filters: ICalculatorFilter | null) {
    if (!filters) return true;
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
        { cal: 0, carb: 0, pro: 0, vit: 0, fat: 0, price: 0 }
    );
    return totals.price <= filters.maxBudget && totals.cal <= filters.maxCalories;
}

export const menuNotValid = (menu: Food[], filters: ICalculatorFilter | null) => {
    return !menuValid(menu, filters);
};
