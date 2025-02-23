import React from "react";
import { useStore } from "@/store/useStore";

export const CalculateResultsSection: React.FC = () => {
  const { calculationResults, selectedFoods } = useStore();

  if (!calculationResults) {
    return (
      <div className="flex flex-col items-center p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Calculation Results</h2>
        <p>No results found</p>
      </div>
    );
  }
  const { sp, multipliers, totals } = calculationResults;

  return (
    <div className="flex flex-col items-center p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Calculation Results</h2>
      <p className="text-xl mb-2">SP: {sp.toFixed(2)}</p>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Multipliers:</h3>
        <p>Balanced: {multipliers.balanced.toFixed(2)}</p>
        <p>Taste: {multipliers.taste.toFixed(2)}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Totals:</h3>
        <p>Calories: {totals.cal}</p>
        <p>Carbs: {totals.carb}g</p>
        <p>Protein: {totals.pro}g</p>
        <p>Fat: {totals.fat}g</p>
        <p>Vitamins: {totals.vit}g</p>
        <p>Price: ${totals.price.toFixed(2)}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Selected Foods:</h3>
        <ul>
          {selectedFoods.map((food) => (
            <li key={food.id}>{food.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
