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

export type FoodType =
  | "Raw"
  | "Campfire"
  | "Bakery"
  | "Kitchen"
  | "Cast Iron Stove"
  | "Stove";

export type ICalculateFilters = {
  maxBudget: number;
  maxCalories: number;
};
export type IFoods = {
  selected: Food[];
  stomach: Food[];
};
export type ITastePref = Record<string, number>;

export type CalculateParameters = {
  foods: IFoods;
  filters: ICalculateFilters | null;
  taste: Map<string, number>;
  menuSize: number;
  calculateType: "definitive" | "random";
};
export type StartWorkerMessage = {
  origin: string;
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
export type IBestMenus = {
  scholar: IBestMenu | null; // best sp menu
  worker: IBestMenu | null; // best cal per dollar menu
  student: IBestMenu | null; // best sp per dollar menu
};
export type IBestMenusMessage = {
  op: "best_menus_update";
  result: IBestMenus;
};

export type ICalculationEndMessage = {
  op: "calculation_end";
};

export type ICalcWorkerMessage = IBestMenusMessage | ICalculationEndMessage;
