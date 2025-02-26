export type Food = {
  id: number;
  name: string;
  type: FoodType;
  tier: number;
  carb: number;
  pro: number;
  fat: number;
  vit: number;
  cal: number;
  weight: number;
};

export type Taste = {
  foodName: number;
  value: number;
};

export type SortableProperty =
  | "cal"
  | "weight"
  | "carb"
  | "fat"
  | "pro"
  | "vit";
export type FoodType =
  | "Kitchen/Stove++"
  | "Cast Iron Stove/Bakery"
  | "Campfire"
  | "Campfire Charred"
  | "Raw Food"
  | "Unknown";

export type FoodTier = "Tier-4" | "Tier-3" | "Tier-2" | "Tier-1" | "Tier-0";
export type ISortOption = {
  id: string;
  label: string;
  desc: boolean;
};
export type SortOptionId =
  | "total_nutrients"
  | "name"
  | "calories"
  | "weight"
  | "carb"
  | "fat"
  | "pro"
  | "vit";

export type FilterState = {
  tier: FoodTier[];
  type: FoodType[];
  sort: ISortOption;
  maxBudget: number;
  maxCalories: number;
};

export type ICalculatorFilters = {
  maxBudget: number;
  maxCalories: number;
};

export type ITastePref = Record<string, number>;

export type CalculateParameters = {
  selectedFoods: Food[];
  taste: Map<string, number>;
  menuSize: number;
  calculateType: "default" | "random";
};
export type StartWorkerMessage = {
  source: "calculator";
  message: "start_worker";
} & CalculateParameters;
export type CalculateSPResult = {
  sp: number;
  foods: {
    menu: Food[];
  };
  multipliers: {
    balanced: number;
    taste: number;
  };
  totals: {
    cal: number;
    carb: number;
    pro: number;
    vit: number;
    fat: number;
    price: number;
  };
};

export enum IBestMenuTypes {
  SCHOLAR = "scholar",
  WORKER = "worker",
  STUDENT = "student",
}

export type IBestMenu = {
  foods: {
    menu: Food[];
  };
  result: CalculateSPResult;
  index: number;
  type: IBestMenuTypes;
};

export type IBestMenus = {
  scholar: IBestMenu | null;
  worker: IBestMenu | null;
  student: IBestMenu | null;
};

export type IBestMenusMessage = {
  op: "best_menus_update";
  result: CalculateSPResult;
};

export type ICalculationEndMessage = {
  op: "calculation_end";
};

export type ICalcWorkerMessage = IBestMenusMessage | ICalculationEndMessage;
