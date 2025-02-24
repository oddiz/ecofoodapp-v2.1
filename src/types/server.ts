import type { Food } from "@/types/food";
import type { FoodShop } from "@/types/shops";

export interface EcoServer {
  name: string;
  address: string;
}

export interface ServerStoreState {
  serverLoading: boolean;
  currentServer: EcoServer;
  availableServers: EcoServer[];
  currentServerFoods: Food[];
  currentServerStores: FoodShop[];
  serverFoods: Record<EcoServer["address"], Food[]>;
  serverShops: Record<EcoServer["address"], FoodShop[]>;
  getServerFoods: (server: EcoServer) => Food[];
  setCurrentServer: (server: EcoServer) => Promise<void>;
  addServer: (
    server: EcoServer,
    serverFoods: Food[],
    serverShops: FoodShop[],
  ) => void;
  removeServer: (server: EcoServer) => void;
}
