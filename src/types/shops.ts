import type { Food } from "@/types/food";

export interface ShopsAPI {
  Stores: EcoShop[];
}

export interface EcoShop {
  Name: string;
  FullAccessUsers: string[];
  Owner: string;
  Balance: number;
  CurrencyName: string;
  Enabled: boolean;
  AllOffers: Offer[];
}

export interface Offer {
  ItemName: string;
  Buying: boolean;
  Price: number;
  Quantity: number;
  Limit: number;
  MaxNumWanted: number;
  MinDurability: number;
}

export interface FoodShop {
  foodsForSale: Food[];
  name: string;
  owner: string;
  coordinates?: [number, number];
  prices: Record<Food["name"], number>;
  quantities: Record<Food["name"], number>;
}
