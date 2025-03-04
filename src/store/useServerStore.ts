import { allFoods } from "@/data/foodData";
import { useFoodStore } from "@/store/useFoodStore";
import type { CalculateSPResult, Food } from "@/types/food";
import type { EcoServer } from "@/types/server";
import type { FoodShop } from "@/types/shops";
import { getFoodsFromAPI } from "@/utils/getServerFoods";
import { getFoodShopsFromAPI } from "@/utils/getServerFoodShops";
import { parseStoreCoordinates } from "@/utils/parseStoreCoordinates";
import { sanitizeUrl } from "@/utils/sanitizeUrl";
import { toast } from "sonner";
import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
const defaultServer: EcoServer = {
  name: "Default",
  address: "http://localhost:3000",
};

const defaultServerFoods: Record<EcoServer["address"], Food[]> = {
  [defaultServer.address]: allFoods,
};
const defaultServerShops: Record<EcoServer["address"], FoodShop[]> = {
  [defaultServer.address]: [],
};
interface ServerStoreState {
  serverLoading: boolean;
  currentServer: EcoServer;
  availableServers: EcoServer[];
  currentServerStores: FoodShop[];
  serverFoods: Record<EcoServer["address"], Food[]>;
  serverShops: Record<EcoServer["address"], FoodShop[]>;
  serverShopCoordinates: Record<
    EcoServer["address"],
    Record<string, [number, number]>
  >;
  serverTastePrefs: Record<EcoServer["address"], Record<string, number>>;
  serverCalculationResults: Record<
    EcoServer["address"],
    Record<string, CalculateSPResult>
  >;
  serverBlacklists: Record<EcoServer["address"], string[]>;
  lastRefreshList: Record<EcoServer["address"], number>;
  getLastRefresh: () => number | undefined;
  setLastRefresh: (time: number) => void;
  getShopResult: (shopName: string) => CalculateSPResult | undefined;
  setServerCalculationResult: (
    shopName: string,
    results: CalculateSPResult,
  ) => void;
  setServerBlacklist: (shopName: string) => void;
  getServerBlacklist: () => string[];
  resetServerBlacklist: () => void;
  getServerTastePref: () => Record<string, number>;
  getCurrentFoods: () => Food[];
  setCurrentServer: (server: EcoServer) => Promise<void>;
  setFoodTaste: (food: Food, value: number) => void;
  addServer: (
    server: EcoServer,
    serverFoods: Food[],
    serverShops: FoodShop[],
  ) => void;
  removeServer: (server: EcoServer) => void;
}

export const useServerStore = create<ServerStoreState>()(
  devtools(
    persist(
      immer((set, get) => ({
        serverLoading: false,
        currentServer: defaultServer,
        availableServers: [defaultServer],
        currentServerStores: defaultServerShops[defaultServer.address]!,
        serverFoods: defaultServerFoods,
        serverShops: defaultServerShops,
        serverShopCoordinates: {},
        serverTastePrefs: {},
        serverCalculationResults: {},
        serverBlacklists: {},
        lastRefreshList: {},

        getLastRefresh: () =>
          get().lastRefreshList[get().currentServer.address],
        setLastRefresh: (time: number) => {
          set((state) => {
            // Direct mutation with Immer
            state.lastRefreshList[state.currentServer.address] = time;
          });
        },
        getShopResult: (shopName) =>
          get().serverCalculationResults[get().currentServer.address]?.[
            shopName
          ],
        setServerCalculationResult: (
          shopName: string,
          results: CalculateSPResult,
        ) => {
          set((state) => {
            const address = state.currentServer.address;
            // Initialize if undefined
            if (!state.serverCalculationResults[address]) {
              state.serverCalculationResults[address] = {};
            }
            // Direct mutation with Immer
            state.serverCalculationResults[address][shopName] = results;
          });
        },
        setServerBlacklist: (shopName: string) => {
          set((state) => {
            const address = state.currentServer.address;
            // Initialize if undefined
            if (!state.serverBlacklists[address]) {
              state.serverBlacklists[address] = [];
            }
            // Direct mutation with Immer
            state.serverBlacklists[address].push(shopName);
          });
        },
        getServerBlacklist: () =>
          get().serverBlacklists[get().currentServer.address] ?? [],
        resetServerBlacklist: () => {
          set((state) => {
            // Direct mutation with Immer
            state.serverBlacklists[state.currentServer.address] = [];
          });
        },
        getServerTastePref: () =>
          get().serverTastePrefs[get().currentServer.address] ?? {},
        setFoodTaste: (food: Food, value: number) => {
          set((state) => {
            const address = state.currentServer.address;
            // Initialize if undefined
            if (!state.serverTastePrefs[address]) {
              state.serverTastePrefs[address] = {};
            }
            // Direct mutation with Immer
            state.serverTastePrefs[address][food.name] = value;
          });
        },
        getCurrentFoods: () => {
          const currentServerAddress = get().currentServer.address;
          return get().serverFoods[currentServerAddress] ?? allFoods;
        },
        setCurrentServer: async (server) => {
          try {
            if (defaultServer.address === server.address) {
              return set((state) => {
                state.currentServer = server;
                state.currentServerStores = [];
              });
            }
            set((state) => {
              state.serverLoading = true;
            });
            const serverFoods = await getFoodsFromAPI(
              sanitizeUrl(server.address),
            );
            const serverShops = await getFoodShopsFromAPI(
              sanitizeUrl(server.address),
              serverFoods,
            );
            const shopsWithCoords = await parseStoreCoordinates(
              sanitizeUrl(server.address),
              serverShops,
            );

            const storeCoordinates = {} as Record<string, [number, number]>;

            shopsWithCoords.updatedShops.forEach((shop) => {
              storeCoordinates[shop.name] = shop.coordinates!;
            });

            // clear selectedFoods
            useFoodStore.getState().setSelectedFoods([]);

            set((state) => {
              state.currentServer = server;
              state.currentServerStores = serverShops ?? [];
              state.serverFoods[server.address] = serverFoods;
              state.serverShops[server.address] = serverShops;
              state.serverShopCoordinates[server.address] = storeCoordinates;

              // Initialize if necessary
              if (!state.serverCalculationResults[server.address]) {
                state.serverCalculationResults[server.address] = {};
              }

              state.serverLoading = false;
              state.lastRefreshList[server.address] = Date.now();
            });
          } catch {
            toast("Failed to fetch server data");
            set((state) => {
              state.serverLoading = false;
            });
          }
        },
        addServer: (server, serverFoods, serverShops) => {
          set((state) => {
            if (!get().availableServers.includes(server)) {
              state.availableServers.push(server);
              state.serverFoods[server.address] = serverFoods;
              state.serverShops[server.address] = serverShops;
              state.serverShopCoordinates[server.address] = {};
            }
          });
        },
        removeServer: (server) => {
          set((state) => {
            state.availableServers = state.availableServers.filter(
              (s) => s.address !== server.address,
            );
          });
        },
      })),
      {
        name: "server-store",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);
