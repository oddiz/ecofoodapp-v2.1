import { allFoods } from "@/data/foodData";
import type { Food } from "@/types/food";
import type { EcoServer, ServerStoreState } from "@/types/server";
import type { FoodShop } from "@/types/shops";
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

export const useServerStore = create<ServerStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        currentServer: defaultServer,
        availableServers: [defaultServer],
        currentServerFoods: defaultServerFoods[defaultServer.address]!,
        currentServerStores: defaultServerShops[defaultServer.address]!,
        serverFoods: defaultServerFoods,
        serverShops: defaultServerShops,
        getServerFoods: (server) =>
          get().serverFoods[server.address] ?? allFoods,
        setCurrentServer: (server) =>
          set({
            currentServer: server,
            currentServerFoods: get()?.serverFoods[server.address] ?? [],
            currentServerStores: get()?.serverShops[server.address] ?? [],
          }),
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
