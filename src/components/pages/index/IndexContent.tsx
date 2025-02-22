import React, { useEffect, useCallback, useMemo } from "react";
import { useNavigator } from "@/hooks/useNavigator";
import { useSearch } from "@/hooks/useSearch";
import { allFoods } from "@/data/foodData";
import { FilterButton } from "./Header/FilterButton";
import { SortButton } from "./Header/SortButton";
import { FoodCard } from "./FoodCard";
import { SelectedFoodsSection } from "./SelectedFoods";
import { useStore } from "@/store/useStore";
import { useFoodFilter } from "@/hooks/useFoodFilter";
import { type Food } from "@/types/food";
import { CalculateResultsSection } from "@/components/pages/index/Calculate/CalculateResultsSection";

const FoodsHeader = React.memo(function FoodsHeader() {
  return (
    <div className="border-primarydark-200/40 border-b-primarydark-500/60 text-primary-950 dark:bg-primarydark-600 flex h-16 w-full flex-shrink-0 flex-grow-0 flex-row items-center border-b-2 px-6">
      <div className="justify flex flex-grow flex-row items-center">
        <SortButton />
        <span className="mx-2 w-12 text-center leading-none">
          {useStore(state => state.activeFilters.sort.label)}
        </span>
      </div>
      <FilterButton />
    </div>
  );
});

const FoodGrid = React.memo(function FoodGrid({ foods, onFoodClicked, selectedFoods }: { foods: Food[], onFoodClicked: (food: Food) => void, selectedFoods: Food[] }) {
  const [showRest, setShowRest] = React.useState(false);
  const MAX_FOODS = 12;

  const renderFoods = useMemo(() => {
    const renderUntil = showRest ? undefined : MAX_FOODS;
    const foodsToRender = foods.slice(0, renderUntil);

    return foodsToRender.map((food) => (
      <div className="h-[140px] w-[240px]" key={food.id}>
        <FoodCard
          onFoodClick={onFoodClicked}
          food={food}
          selected={selectedFoods.some((selFood) => selFood.id === food.id)}
        />
      </div>
    ));
  }, [foods, showRest, selectedFoods, onFoodClicked]);

  const loadMoreButton = useMemo(() => {
    if (foods.length > MAX_FOODS && !showRest) {
      return (
        <div key="showrestbutton" className="my-10 flex h-52 w-full items-start justify-center">
          <button
            type="button"
            className="flex h-14 items-center justify-center rounded-xl p-6 text-base dark:bg-purple-500/40"
            onClick={() => setShowRest(true)}
          >
            Load more...
          </button>
        </div>
      );
    }
    return null;
  }, [foods.length, showRest]);

  return (
    <div className="flex-grow-1 flex w-full flex-col items-center pb-10 pt-5">
      <div className="grid grid-cols-2 gap-5 auto-rows-[140px]">
        {renderFoods}
      </div>
      {loadMoreButton}
    </div>
  );
});

export const IndexContent = () => {
  const { setActivePage } = useNavigator();
  const { searchInput } = useSearch();
  const { selectedFoods, activeFilters, addFood, removeFood } = useStore();

  useEffect(() => {
    setActivePage("home");
  }, [setActivePage]);

  const filteredFoods = useFoodFilter(allFoods, activeFilters, searchInput);

  const croppedFoods = filteredFoods.slice(0, 12);

  const onFoodClicked = useCallback(
    (food: Food) => {
      if (selectedFoods.some((selFood) => selFood.id === food.id)) {
        removeFood(food);
      } else {
        addFood(food);
      }
    },
    [selectedFoods, removeFood, addFood],
  );

  return (
    <div className="flex h-full flex-1 flex-row overflow-hidden">
      <div id="foods_section" className="border-r-primarydark-200/40 flex h-full w-1/3 min-w-[510px] flex-col border-r-2 overflow-scroll">
        <FoodsHeader />
        <FoodGrid foods={croppedFoods} onFoodClicked={onFoodClicked} selectedFoods={selectedFoods} />
      </div>
      <div className="border-r-primarydark-200/40 flex h-full min-w-[400px] flex-col border-r-2">
        <div className="border-primarydark-200/40 border-b-primarydark-500/60 text-primary-950 dark:bg-primarydark-600 flex h-16 w-full flex-shrink-0 flex-grow-0 flex-row items-center justify-center border-b-2 px-6">
          <span className="text-ecored-300/80 font-[Cubano] text-2xl">
            Selected Foods
          </span>
        </div>
        <SelectedFoodsSection
          selectedFoods={selectedFoods}
          removeFood={removeFood}
        />
      </div>
      <div className="border-r-primarydark-200/40 flex h-full min-w-[400px] flex-1 flex-col border-r-2">
        <CalculateResultsSection />
      </div>
    </div>
  );
};
