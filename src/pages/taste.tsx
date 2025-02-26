import React from "react";
import { type Food } from "@/types/food";
import { useServerStore } from "@/store/useServerStore";
import { useSearch } from "@/hooks/useSearch";

const TastePage = () => {
  const { currentServerFoods, getServerTastePref, setFoodTaste } =
    useServerStore();
  const { searchInput } = useSearch();
  // Load existing taste preferences

  // Handle taste selection
  const handleTasteSelect = (food: Food, value: number) => {
    // Update preference
    setFoodTaste(food, value);
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-y-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-ecogreen-400">
          Taste Preferences
        </h1>
      </div>

      <div className="mb-6 p-4 bg-primarydark-500 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">How Taste Works</h2>
        <p className="text-sm opacity-80">
          In Eco, each player has unique taste preferences that affect the skill
          points gained from food. You may select exactly 1 Favorite food and 1
          Worst food, with other rankings between those extremes. Better-tasting
          foods give more skill points!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentServerFoods
          .filter((food) => {
            if (!searchInput) return true;
            return food.name.toLowerCase().includes(searchInput.toLowerCase());
          })
          .map((food) => (
            <FoodTasteCard
              key={food.id}
              food={food}
              tasteValue={getServerTastePref()[food.name] ?? 0}
              onChange={handleTasteSelect}
            />
          ))}
      </div>
    </div>
  );
};

const FoodTasteCard = ({
  food,
  tasteValue,
  onChange,
}: {
  food: Food;
  tasteValue: number;
  onChange: (food: Food, value: number) => void;
}) => {
  // Map taste values to labels
  const tasteLabels = [
    { value: -3, label: "Worst", color: "bg-ecored-500" },
    { value: -2, label: "Horrible", color: "bg-ecored-400" },
    { value: -1, label: "Bad", color: "bg-ecored-300" },
    { value: 0, label: "Ok", color: "bg-primarydark-300" },
    { value: 1, label: "Good", color: "bg-ecogreen-300" },
    { value: 2, label: "Delicious", color: "bg-ecogreen-400" },
    { value: 3, label: "Favorite", color: "bg-ecogreen-500" },
  ];

  const isFavorite = tasteValue === 3;
  const isWorst = tasteValue === -3;

  return (
    <div
      className={`p-3 rounded-lg border ${isFavorite ? "border-ecogreen-400" : isWorst ? "border-ecored-400" : "border-primarydark-200/40"} bg-primarydark-500 flex flex-col`}
    >
      <div className="flex items-center mb-2">
        <h3 className="font-bold flex-1">{food.name}</h3>
        <span className="text-xs opacity-70">{food.type}</span>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {tasteLabels.map((taste) => (
          <button
            key={taste.value}
            onClick={() => onChange(food, taste.value)}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              tasteValue === taste.value
                ? `${taste.color} text-primarydark-600 font-bold`
                : "bg-primarydark-400 hover:bg-primarydark-300"
            } ${(taste.value === 3 && isFavorite) || (taste.value === -3 && isWorst) ? "ring-2 ring-white" : ""}`}
          >
            {taste.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TastePage;
