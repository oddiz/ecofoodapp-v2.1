import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Radio,
  RadioGroup,
} from "@headlessui/react";
import { FaSortNumericDown } from "react-icons/fa";
import { useFoodStore } from "@/store/useFoodStore"; // Adjust the import path as needed
import type { ISortOption, Food, SortableProperty } from "@/types/food";

const sortOptions: ISortOption[] = [
  { id: "total_nutrients", label: "Total Nutrients", desc: true },
  { id: "name", label: "Name", desc: true },
  { id: "calories", label: "Calories", desc: true },
  { id: "weight", label: "Weight", desc: true },
  { id: "carb", label: "Carbs", desc: true },
  { id: "fat", label: "Fat", desc: true },
  { id: "pro", label: "Protein", desc: true },
  { id: "vit", label: "Vitamins", desc: true },
];

const isSortableProperty = (property: string): property is SortableProperty => {
  return ["calories", "weight", "carb", "fat", "pro", "vit"].includes(property);
};

const getSortValue = (food: Food, property: SortableProperty): number => {
  if (isSortableProperty(property)) {
    return food[property];
  }
  return 0;
};

const sortFunctions: Record<string, (a: Food, b: Food) => number> = {
  total_nutrients: (a, b) =>
    b.cal +
    b.carb +
    b.fat +
    b.pro +
    b.vit -
    (a.cal + a.carb + a.fat + a.pro + a.vit),
  name: (a, b) => a.name.localeCompare(b.name),
  calories: (a, b) => getSortValue(b, "cal") - getSortValue(a, "cal"),
  weight: (a, b) => getSortValue(b, "weight") - getSortValue(a, "weight"),
  carb: (a, b) => getSortValue(b, "carb") - getSortValue(a, "carb"),
  fat: (a, b) => getSortValue(b, "fat") - getSortValue(a, "fat"),
  pro: (a, b) => getSortValue(b, "pro") - getSortValue(a, "pro"),
  vit: (a, b) => getSortValue(b, "vit") - getSortValue(a, "vit"),
};

export function SortButton() {
  const { activeFilters, setActiveFilters, selectedFoods, setSelectedFoods } =
    useFoodStore();

  function handleSortSelect(sortOption: ISortOption) {
    setActiveFilters({
      ...activeFilters,
      sort: sortOption,
    });
    sortFoods(sortOption.id, sortOption.desc);
  }

  function toggleSortDirection() {
    const newSort = { ...activeFilters.sort, desc: !activeFilters.sort.desc };
    setActiveFilters({
      ...activeFilters,
      sort: newSort,
    });
    sortFoods(newSort.id, newSort.desc);
  }

  function sortFoods(sortId: string, desc: boolean) {
    const sortFunction = sortFunctions[sortId];
    if (!sortFunction) {
      console.error(`No sort function found for id: ${sortId}`);
      return;
    }

    const sortedFoods = [...selectedFoods].sort((a, b) => {
      const compareResult = sortFunction(a, b);
      return desc ? compareResult : -compareResult;
    });
    setSelectedFoods(sortedFoods);
  }

  return (
    <Popover className="relative">
      <PopoverButton className="flex items-center hover:text-primary-800">
        <FaSortNumericDown className="hover:fill-primary-200" size={30} />
        <span className="ml-2">{activeFilters.sort.label}</span>
        <span className="ml-1">{activeFilters.sort.desc ? "▼" : "▲"}</span>
      </PopoverButton>

      <PopoverPanel className="absolute z-10  text-primary-600">
        <div className="flex w-40 flex-col rounded-xl text-lg bg-primarydark-100">
          <header className="flex h-12 items-center justify-between border-b-2 px-4 border-b-primarydark-300">
            <span>Sort By:</span>
            <button onClick={toggleSortDirection}>
              {activeFilters.sort.desc ? "▼" : "▲"}
            </button>
          </header>
          <RadioGroup
            value={activeFilters.sort.id}
            onChange={(value: string) => {
              const selectedOption = sortOptions.find(
                (option) => option.id === value,
              );
              if (selectedOption) {
                handleSortSelect(selectedOption);
              }
            }}
          >
            {sortOptions.map((option) => (
              <Radio
                key={option.id}
                value={option.id}
                className="my-2 flex w-full justify-center text-base"
              >
                {({ checked }) => (
                  <span
                    className={
                      (checked ? " bg-ecogreen-500/80 text-primary-100" : "") +
                      " w-full p-2"
                    }
                  >
                    {option.label}
                  </span>
                )}
              </Radio>
            ))}
          </RadioGroup>
        </div>
      </PopoverPanel>
    </Popover>
  );
}
