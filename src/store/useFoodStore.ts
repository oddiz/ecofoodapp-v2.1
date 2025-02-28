import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import {
  type CalculateSPResult,
  type FilterState,
  type Food,
} from "@/types/food"; // Adjust import path as needed
import { useServerStore } from "@/store/useServerStore";

interface StoreState {
  selectedFoods: Food[];
  activeFilters: FilterState;
  calculationResults: CalculateSPResult | null;
  setSelectedFoods: (foods: Food[]) => void;
  addSelectedFood: (food: Food) => void;
  removeSelectedFood: (food: Food) => void;
  getAllFoods: () => Food[];
  setActiveFilters: (filters: FilterState) => void;
  setCalculationResults: (results: CalculateSPResult | null) => void;
}

const defaultFilters: FilterState = {
  tier: [],
  type: [],
  sort: { id: "total_nutrients", label: "Total Nutrients", desc: true },
  maxBudget: 0,
  maxCalories: 0,
};

export const useFoodStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        selectedFoods: [],
        activeFilters: defaultFilters,
        calculationResults: null,
        setSelectedFoods: (foods) => set({ selectedFoods: foods }),
        getAllFoods: () => {
          const serverState = useServerStore.getState();
          return serverState.getServerFoods(serverState.currentServer);
        },
        addSelectedFood: (food) =>
          set((state) => ({ selectedFoods: [...state.selectedFoods, food] })),
        removeSelectedFood: (food) =>
          set((state) => ({
            selectedFoods: state.selectedFoods.filter((f) => f.id !== food.id),
          })),
        setActiveFilters: (filters) => set({ activeFilters: filters }),
        setCalculationResults: (results) =>
          set({ calculationResults: results }),
      }),
      {
        name: "food-store",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          selectedFoods: state.selectedFoods,
          activeFilters: state.activeFilters,
        }),
      },
    ),
  ),
);
