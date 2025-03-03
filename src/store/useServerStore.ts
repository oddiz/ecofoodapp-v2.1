import { allFoods } from "@/data/foodData";
import type { CalculateSPResult, Food } from "@/types/food";
import type { EcoServer } from "@/types/server";
import type { FoodShop } from "@/types/shops";
import { getServerFoods } from "@/utils/getServerFoods";
import { getServerFoodShops } from "@/utils/getServerFoodShops";
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
  currentServerFoods: Food[];
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
  getServerFoods: (server: EcoServer) => Food[];
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
        currentServerFoods: defaultServerFoods[defaultServer.address]!,
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
        getServerFoods: (server) =>
          get().serverFoods[server.address] ?? allFoods,
        setCurrentServer: async (server) => {
          try {
            if (defaultServer.address === server.address) {
              return set((state) => {
                state.currentServer = server;
                state.currentServerFoods = allFoods;
                state.currentServerStores = [];
              });
            }
            set((state) => {
              state.serverLoading = true;
            });
            const serverFoods = await getServerFoods(
              sanitizeUrl(server.address),
            );
            const serverShops = await getServerFoodShops(
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

            set((state) => {
              state.currentServer = server;
              state.currentServerFoods = serverFoods ?? [];
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
            return;
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
              (s) => s !== server,
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
