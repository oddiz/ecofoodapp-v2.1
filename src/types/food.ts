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
  price: number;
};
export type SortableProperty =
  | "cal"
  | "weight"
  | "carb"
  | "fat"
  | "pro"
  | "vit";
export type FoodType =
  | "Raw"
  | "Campfire"
  | "Bakery"
  | "Kitchen"
  | "Cast Iron Stove"
  | "Stove";

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
  stomachFoods: Food[];
  filters: FilterState;
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
    stomach: Food[];
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

export type IBestMenu = {
  foods: {
    menu: Food[];
    stomach: Food[];
  };
  result: CalculateSPResult;
  index: number;
};

export type IBestMenusMessage = {
  op: "best_menus_update";
  result: CalculateSPResult;
};

export type ICalculationEndMessage = {
  op: "calculation_end";
};

export type ICalcWorkerMessage = IBestMenusMessage | ICalculationEndMessage;
