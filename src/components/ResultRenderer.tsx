import { useServerStore } from "@/store/useServerStore";
import { useShoppingStore } from "@/store/useShoppingStore";
import type { CalculateSPResult, Food } from "@/types/food";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface GroupedFood {
  food: Food;
  count: number;
}

const ResultRenderer = ({
  result,
  shopName = "",
}: {
  result: CalculateSPResult | "loading";
  shopName: string;
}) => {
  const { currentServerStores } = useServerStore();
  const { addToShoppingList } = useShoppingStore();

  if (result === "loading") {
    return <></>;
  }

  // Group identical foods
  const groupedFoods = result.foods.menu.reduce((acc: GroupedFood[], food) => {
    const existing = acc.find((item) => item.food.id === food.id);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ food, count: 1 });
    }
    return acc;
  }, []);

  const shop = currentServerStores.find((store) => store.name === shopName);

  const totalPrice = groupedFoods.reduce((acc, { food, count }) => {
    const price = shop?.prices?.[food.name] ?? 0;
    return acc + price * count;
  }, 0);

  const handleAddToShoppingList = () => {
    // Add each food in the calculated menu to the shopping list with their quantities
    groupedFoods.forEach(({ food, count }) => {
      addToShoppingList(food, count);
    });

    toast.success(`Added ${result.foods.menu.length} items to shopping list`);
  };

  return (
    <div className="flex flex-col w-full h-full p-4 rounded-lg bg-primarydark-700/50 border border-primarydark-400/20">
      {/* Add to Shopping List Button */}
      <button
        onClick={handleAddToShoppingList}
        className="mb-4 h-10 w-full bg-ecoblue-600/30 hover:bg-ecoblue-700 text-primary-100 rounded-md flex items-center justify-center gap-2 transition-colors"
      >
        <ShoppingCart size={16} />
        <span>Add to Shopping List</span>
      </button>

      {/* Multipliers Section */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="p-3 rounded-md bg-primarydark-600/50 text-center flex flex-col">
          <p className="text-xs text-primary-400 mb-1">SP Value</p>
          <p className="text-xl font-bold text-ecogreen-400 mt-auto">
            {result.sp.toFixed(1)}
          </p>
        </div>
        <div className="p-3 rounded-md bg-primarydark-600/50 text-center">
          <p className="text-xs text-primary-400 mb-1">Balance Mult</p>
          <p className="text-xl font-bold text-ecoyellow-400">
            {result.multipliers.balanced.toFixed(2)}x
          </p>
        </div>
        <div className="p-3 rounded-md bg-primarydark-600/50 text-center flex flex-col">
          <p className="text-xs text-primary-400 mb-1 flex-grow">Taste Mult</p>
          <p className="text-xl font-bold text-ecogreen-400 mt-auto ">
            {result.multipliers.taste.toFixed(2)}x
          </p>
        </div>
      </div>

      {/* Foods Section */}
      <div className="space-y-2 mb-6">
        <h3 className="text-sm font-semibold text-primary-200 mb-3">
          Best Combination
        </h3>
        {groupedFoods.map(({ food, count }) => (
          <div
            key={food.id}
            className="flex items-center justify-between p-2 rounded-md bg-primarydark-600/50"
          >
            <div className="flex items-center">
              <span className="text-primary-300 text-xs">{food.name}</span>
              {count > 1 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primarydark-500 text-primary-400">
                  x{count}
                </span>
              )}
            </div>
            {shop?.prices?.[food.name] && (
              <span className="text-xs text-ecogreen-400">
                ${shop.prices[food.name]!.toFixed(2)}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Totals Section */}
      <div className="pt-4 border-t border-primarydark-400/40 mt-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-sm">
            <p className="text-primary-400">Total Calories</p>
            <p className="text-lg font-semibold text-primary-200">
              {result.totals.cal.toFixed(0)}
            </p>
          </div>
          <div className="text-sm">
            <p className="text-primary-400">Total Price</p>
            <p className="text-lg font-semibold text-ecogreen-400">
              ${totalPrice.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultRenderer;
