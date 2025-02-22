import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  type CalculateSPResult,
  type FilterState,
  type Food,
} from "@/types/food"; // Adjust import path as needed

interface StoreState {
  selectedFoods: Food[];
  activeFilters: FilterState;
  calculationResults: CalculateSPResult | null;
  setSelectedFoods: (foods: Food[]) => void;
  addFood: (food: Food) => void;
  removeFood: (food: Food) => void;
  setActiveFilters: (filters: FilterState) => void;
  setCalculationResults: (results: CalculateSPResult | null) => void;
}

const defaultFilters: FilterState = {
  tier: ["Tier-4"],
  type: [],
  sort: { id: "total_nutrients", label: "Total Nutrients", desc: true },
  maxBudget: 0,
  maxCalories: 0,
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      selectedFoods: [],
      activeFilters: defaultFilters,
      calculationResults: null,
      setSelectedFoods: (foods) => set({ selectedFoods: foods }),
      addFood: (food) =>
        set((state) => ({ selectedFoods: [...state.selectedFoods, food] })),
      removeFood: (food) =>
        set((state) => ({
          selectedFoods: state.selectedFoods.filter((f) => f.id !== food.id),
        })),
      setActiveFilters: (filters) => set({ activeFilters: filters }),
      setCalculationResults: (results) => set({ calculationResults: results }),
    }),
    {
      name: "food-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedFoods: state.selectedFoods,
        activeFilters: state.activeFilters,
        // We don't persist calculationResults as they should be recalculated each time
      }),
    },
  ),
);
