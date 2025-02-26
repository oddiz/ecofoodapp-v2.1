import { allFoods } from "@/data/foodData";
import type { Food } from "@/types/food";
import type { EcoServer } from "@/types/server";
import type { FoodShop } from "@/types/shops";
import { getServerFoods } from "@/utils/getServerFoods";
import { getServerFoodShops } from "@/utils/getServerFoodShops";
import { sanitizeUrl } from "@/utils/sanitizeUrl";
import { toast } from "sonner";
import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

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
  serverTastePrefs: Record<EcoServer["address"], Record<string, number>>;

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
      (set, get) => ({
        serverLoading: false,
        currentServer: defaultServer,
        availableServers: [defaultServer],
        currentServerFoods: defaultServerFoods[defaultServer.address]!,
        currentServerStores: defaultServerShops[defaultServer.address]!,
        serverFoods: defaultServerFoods,
        serverShops: defaultServerShops,
        serverTastePrefs: {},
        getServerTastePref: () =>
          get().serverTastePrefs[get().currentServer.address] ?? {},
        setFoodTaste: (food: Food, value: number) => {
          set((state) => {
            const address = state.currentServer.address;
            const currentPrefs = state.serverTastePrefs[address] ?? {};
            return {
              serverTastePrefs: {
                ...state.serverTastePrefs,
                [address]: {
                  ...currentPrefs,
                  [food.name]: value,
                },
              },
            };
          });
        },
        getServerFoods: (server) =>
          get().serverFoods[server.address] ?? allFoods,
        setCurrentServer: async (server) => {
          try {
            if (defaultServer.address === server.address) {
              return set({
                currentServer: server,
                currentServerFoods: allFoods,
                currentServerStores: [],
              });
            }
            set({ serverLoading: true });
            const serverFoods = await getServerFoods(
              sanitizeUrl(server.address),
            );
            const serverShops = await getServerFoodShops(
              sanitizeUrl(server.address),
              serverFoods,
            );
            set((state) => ({
              currentServer: server,
              currentServerFoods: serverFoods ?? [],
              currentServerStores: serverShops ?? [],
              serverFoods: {
                ...state.serverFoods,
                [server.address]: serverFoods,
              },
              serverShops: {
                ...state.serverShops,
                [server.address]: serverShops,
              },
              serverLoading: false,
            }));
          } catch {
            toast("Failed to fetch server data");
            set({ serverLoading: false });
            return;
          }
        },
        addServer: (server, serverFoods, serverShops) => {
          set((state) => {
            if (!get().availableServers.includes(server)) {
              return {
                availableServers: [...state.availableServers, server],
                serverFoods: {
                  ...state.serverFoods,
                  [server.address]: serverFoods,
                },
                serverShops: {
                  ...state.serverShops,
                  [server.address]: serverShops,
                },
              };
            }
            return state;
          });
        },
        removeServer: (server) => {
          set((state) => ({
            availableServers: state.availableServers.filter(
              (s) => s !== server,
            ),
          }));
        },
      }),
      {
        name: "server-store",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);
