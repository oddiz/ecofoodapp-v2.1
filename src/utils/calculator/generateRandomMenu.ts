import { type Food } from "@/types/food";

export function generateRandomMenu(activeFoods: Food[], foodCount: number) {
  const randomMenu = [];
  for (let i = 0; i < foodCount; i++) {
    randomMenu.push(
      activeFoods[Math.floor(Math.random() * activeFoods.length)],
    );
  }
  return randomMenu;
}
