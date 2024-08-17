import { Popover, RadioGroup } from "@headlessui/react";
import { useEffect, useState } from "react";
import { FaSortNumericDown } from "react-icons/fa";
import { SortOptionId } from "../IndexContent";

export type ISortOption = {
    id: SortOptionId;
    label: string;
    desc?: boolean;
};
const sortOptions: ISortOption[] = [
    { id: "total_nutrients", label: "Total Nutrients" },
    { id: "name", label: "Name" },
    { id: "calories", label: "Calories" },
    { id: "weight", label: "Weight" },
    { id: "carb", label: "Carbs" },
    { id: "fat", label: "Fat" },
    { id: "pro", label: "Protein" },
    { id: "vit", label: "Vitamins" },
];
export function SortButton({ filters, setActiveFilters }: any) {
    const [selectedSort, setSelectedSort] = useState<ISortOption>(sortOptions[0]);
    function handleSortSelect(sortOption: ISortOption) {
        setSelectedSort(sortOption);
        setActiveFilters((prev: any) => {
            return {
                ...prev,
                sort: sortOption,
            };
        });
    }
    useEffect(() => {
        setSelectedSort(filters?.sort || sortOptions[0]);
    }, [filters]);
    return (
        <Popover className="relative">
            <Popover.Button>
                <FaSortNumericDown />
            </Popover.Button>

            <Popover.Panel className="absolute z-10 text-primary-600">
                <div className="flex w-40 flex-col rounded-xl text-lg dark:bg-primarydark-100">
                    <header className="flex h-12 items-center border-b-2 pl-4 dark:border-b-primarydark-300">
                        Sort By:
                    </header>
                    <RadioGroup
                        value={selectedSort.label}
                        onChange={(value: SortOptionId) => {
                            handleSortSelect(sortOptions.filter((option) => option.label === value)[0]);
                        }}
                    >
                        {sortOptions.map((option) => (
                            <RadioGroup.Option
                                key={option.id}
                                value={option.label}
                                className="my-2 flex w-full justify-center text-base"
                            >
                                {({ checked }) => (
                                    <span
                                        className={
                                            (checked ? " bg-ecogreen-500/80 text-primary-100" : "") + " w-full p-2"
                                        }
                                    >
                                        {option.label}
                                    </span>
                                )}
                            </RadioGroup.Option>
                        ))}
                    </RadioGroup>
                </div>
            </Popover.Panel>
        </Popover>
    );
}

/*
<a>Name</a>
<a>Tier</a>
<a>Type</a>
<a>Calories</a>
<a>Weight</a>
<a>Protein</a>
<a>Vitamin</a>
<a>Carbohydrate</a>
<a>Fat</a>
*/
