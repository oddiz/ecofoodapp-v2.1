import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import {
  type CalculateSPResult,
  type FilterState,
  type Food,
} from "@/types/food"; // Adjust import path as needed
import { useServerStore } from "@/store/useServerStore";
import { immer } from "zustand/middleware/immer";

interface StoreState {
  selectedFoods: Food[];
  activeFilters: FilterState;
  calculationResults: CalculateSPResult | null;
  setSelectedFoods: (foods: Food[]) => void;
  addSelectedFood: (food: Food) => void;
  removeSelectedFood: (food: Food) => void;
  removeAllSelectedFoods: () => void;
  getAllFoods: () => Food[];
  getFoodQuantity: (foodName: string) => number;
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
      immer((set) => ({
        selectedFoods: [],
        activeFilters: defaultFilters,
        calculationResults: null,
        getFoodQuantity: (foodName) => {
          const serverStores = useServerStore.getState().currentServerStores;

          const foodQuantity = serverStores.reduce((acc, store) => {
            const foodAmt = store.quantities[foodName];
            if (foodAmt) {
              return acc + foodAmt;
            }
            return acc;
          }, 0);

          return foodQuantity;
        },

        setSelectedFoods: (foods) =>
          set((state) => {
            state.selectedFoods = foods;
          }),

        getAllFoods: () => {
          const serverState = useServerStore.getState();
          return serverState.getCurrentFoods();
        },

        addSelectedFood: (food) =>
          set((state) => {
            state.selectedFoods.push(food);
          }),

        removeSelectedFood: (food) =>
          set((state) => {
            state.selectedFoods = state.selectedFoods.filter(
              (f) => f.id !== food.id,
            );
          }),

        removeAllSelectedFoods: () =>
          set((state) => {
            state.selectedFoods = [];
          }),

        setActiveFilters: (filters) =>
          set((state) => {
            state.activeFilters = filters;
          }),

        setCalculationResults: (results) =>
          set((state) => {
            state.calculationResults = results;
          }),
      })),
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
