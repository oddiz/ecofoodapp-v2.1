"use client";

import { type Food } from "@/types/food";
import { useNavigator } from "@/hooks/useNavigator";
import { useSearch } from "@/hooks/useSearch";
import { useEffect, useState, useCallback, useMemo } from "react";
import { allFoods } from "@/data/foodData";
import { layout, CSSGrid } from "react-stonecutter";
import {
  FilterButton,
} from "./Header/FilterButton";
import { SortButton } from "./Header/SortButton";
import { FoodCard } from "./FoodCard";
import { SelectedFoodsSection } from "./SelectedFoods";
import { CalculateSection } from "./Calculate/CalculateSection";
import { useStore } from "@/store/useStore";
import { type LayoutFunction } from "react-stonecutter";
import { useFoodFilter } from "@/hooks/useFoodFilter";

interface CSSGridProps {
  component?: string;
  columns: number;
  columnWidth: number;
  itemHeight: number;
  gutterWidth?: number;
  gutterHeight?: number;
  layout: LayoutFunction;
  duration: number;
  easing?: (t: number) => number;
  entered?: boolean;
  perspective?: number;
  springConfig?: object;
  style?: React.CSSProperties;
}
export const GridComponent = CSSGrid as React.ComponentType<
  CSSGridProps & { children: React.ReactNode }
>;

const foods: Food[] = allFoods;

export const IndexContent = () => {
  const { setActivePage } = useNavigator();
  const { searchInput } = useSearch();
  const {
    selectedFoods,
    activeFilters,
    addFood,
    removeFood,
  } = useStore();
  const [showRest, setShowRest] = useState(false);

  useEffect(() => {
    setActivePage("home");
  }, [setActivePage]);

  const filteredFoods = useFoodFilter(foods, activeFilters, searchInput);

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

  const renderFoods = useMemo(() => {
    const MAX_FOODS = 12;
    const renderUntil = showRest ? undefined : MAX_FOODS;
    const foodsToRender = filteredFoods.slice(0, renderUntil);

    const renderedFoods = foodsToRender.map((food) => (
      <div className="h-[140px] w-[240px]" key={food.id}>
        <FoodCard
          onFoodClick={onFoodClicked}
          food={food}
          selected={selectedFoods.some((selFood) => selFood.id === food.id)}
        />
      </div>
    ));

    if (filteredFoods.length > MAX_FOODS && !showRest) {
      renderedFoods.push(
        <div
          key="showrestbutton"
          className="my-10 flex h-52 w-full items-start justify-center"
        >
          <button
            type="button"
            className="flex h-14 items-center justify-center rounded-xl p-6 text-base dark:bg-purple-500/40"
            onClick={() => setShowRest(true)}
          >
            Load more...
          </button>
        </div>,
      );
    }

    return renderedFoods;
  }, [filteredFoods, showRest, selectedFoods, onFoodClicked]);

  return (
    <div className="flex h-full flex-1 flex-row overflow-hidden">
      <div
        id="foods_section"
        className="border-r-primarydark-200/40 flex h-full w-1/3 min-w-[510px] flex-col border-r-2"
      >
        <div className="border-primarydark-200/40 border-b-primarydark-500/60 text-primary-950 dark:bg-primarydark-600 flex h-16 w-full flex-shrink-0 flex-grow-0 flex-row items-center border-b-2 px-6">
          <div className="justify flex flex-grow flex-row items-center">
            <SortButton
            />
            <span className="mx-2 w-12 text-center leading-none">
              {activeFilters.sort.label}
            </span>
          </div>
          <FilterButton  />
        </div>
          <div className="flex-grow-1 flex w-full flex-col items-center pb-10 pt-5">
            <GridComponent
              component="div"
              columns={2}
              columnWidth={240}
              itemHeight={140}
              gutterWidth={5}
              gutterHeight={5}
              layout={layout.simple}
              duration={150}
            >
              {renderFoods}
            </GridComponent>
          </div>
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
        <CalculateSection  />
      </div>
    </div>
  );
};
