import type { CalculateSPResult, Food } from "@/types/food";

interface GroupedFood {
  food: Food;
  count: number;
}

const ResultRenderer = ({ result }: { result: CalculateSPResult }) => {
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

  return (
    <div className="w-full p-4 rounded-lg bg-primarydark-700/50 border border-primarydark-400/20">
      {/* Multipliers Section */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="p-3 rounded-md bg-primarydark-600/50 text-center">
          <p className="text-xs text-primary-400 mb-1">SP Value</p>
          <p className="text-xl font-bold text-ecogreen-400">
            {result.sp.toFixed(2)}
          </p>
        </div>
        <div className="p-3 rounded-md bg-primarydark-600/50 text-center">
          <p className="text-xs text-primary-400 mb-1">Balance Mult</p>
          <p className="text-xl font-bold text-ecoyellow-400">
            {result.multipliers.balanced.toFixed(2)}x
          </p>
        </div>
        <div className="p-3 rounded-md bg-primarydark-600/50 text-center">
          <p className="text-xs text-primary-400 mb-1">Taste Mult</p>
          <p className="text-xl font-bold text-ecogreen-400">
            {result.multipliers.taste.toFixed(2)}x
          </p>
        </div>
      </div>

      {/* Foods Section */}
      <div className="space-y-2 mb-6">
        <h3 className="text-sm font-semibold text-primary-200 mb-3">
          Selected Foods
        </h3>
        {groupedFoods.map(({ food, count }) => (
          <div
            key={food.id}
            className="flex items-center justify-between p-2 rounded-md bg-primarydark-600/50"
          >
            <div className="flex items-center">
              <span className="text-primary-300">{food.name}</span>
              {count > 1 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primarydark-500 text-primary-400">
                  x{count}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Totals Section */}
      <div className="pt-4 border-t border-primarydark-400/40">
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
              ${result.totals.price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultRenderer;
