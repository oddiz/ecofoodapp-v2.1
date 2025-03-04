import { type Food } from "@/types/food";
import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useServerStore } from "./useServerStore";

// Default empty shopping list
const defaultShoppingList: ShoppingItem[] = [];

// Type for an item in the shopping list
export interface ShoppingItem {
  food: Food;
  quantity: number;
  shops: {
    shopName: string;
    price: number;
    shopQuantity: number;
    coordinates?: [number, number];
  }[];
}

interface ShoppingStoreState {
  shoppingList: ShoppingItem[];
  isMapVisible: boolean;
  // Actions
  addToShoppingList: (food: Food, quantity?: number) => void;
  removeFromShoppingList: (foodId: number) => void;
  updateQuantity: (foodId: number, quantity: number) => void;
  clearShoppingList: () => void;
  toggleMapVisibility: () => void;
  // Getters
  getShoppingList: () => ShoppingItem[];
  getTotalCost: () => number;
  getShopsForItems: () => string[];
}

export const useShoppingStore = create<ShoppingStoreState>()(
  devtools(
    persist(
      immer((set, get) => ({
        shoppingList: defaultShoppingList,
        isMapVisible: false,

        addToShoppingList: (food: Food, quantity = 1) => {
          set((state) => {
            // Get current server stores to find shops selling this food
            const { currentServerStores } = useServerStore.getState();

            const storeCoords =
              useServerStore.getState().serverShopCoordinates[
                useServerStore.getState().currentServer.address
              ];

            // Find shops that sell this food along with their prices
            const shops = currentServerStores
              .filter((shop) => shop.foodsForSale.some((f) => f.id === food.id))
              .filter(
                (shop) =>
                  (shop.quantities?.[food.name] &&
                    shop.quantities?.[food.name]) ??
                  0 > 0,
              )
              .map((shop) => ({
                shopName: shop.name,
                price: shop.prices?.[food.name] ?? 0,
                shopQuantity: shop.quantities?.[food.name] ?? 0,
                coordinates: storeCoords?.[shop.name],
              }))
              .sort((a, b) => a.price - b.price); // Sort by lowest price

            // Check if food already exists in the list
            const existingItem = state.shoppingList.find(
              (item) => item.food.id === food.id,
            );

            if (existingItem) {
              // Update existing item
              existingItem.quantity += quantity;
              existingItem.shops = shops;
            } else {
              // Add new item
              state.shoppingList.push({
                food,
                quantity,
                shops,
              });
            }
          });
        },

        removeFromShoppingList: (foodId: number) => {
          set((state) => {
            state.shoppingList = state.shoppingList.filter(
              (item) => item.food.id !== foodId,
            );
          });
        },

        updateQuantity: (foodId: number, quantity: number) => {
          set((state) => {
            const item = state.shoppingList.find(
              (item) => item.food.id === foodId,
            );
            if (item && quantity > 0) {
              item.quantity = quantity;
            }
          });
        },

        clearShoppingList: () => {
          set((state) => {
            state.shoppingList = [];
          });
        },

        toggleMapVisibility: () => {
          set((state) => {
            state.isMapVisible = !state.isMapVisible;
          });
        },

        getShoppingList: () => get().shoppingList,

        getTotalCost: () => {
          return get().shoppingList.reduce((total, item) => {
            // Find the lowest price among shops for each item
            const lowestPrice =
              item.shops.length > 0
                ? Math.min(...item.shops.map((shop) => shop.price))
                : 0;

            return total + lowestPrice * item.quantity;
          }, 0);
        },

        getShopsForItems: () => {
          // Get unique shop names from all items' shops
          const allShops = new Set<string>();
          get().shoppingList.forEach((item) => {
            item.shops.forEach((shop) => {
              allShops.add(shop.shopName);
            });
          });

          return Array.from(allShops);
        },
      })),
      {
        name: "shopping-list-store",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);
