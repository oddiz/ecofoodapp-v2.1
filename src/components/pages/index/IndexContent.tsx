import { Food, FoodType, IFoods } from "@/types/food";
import { useNavigator } from "hooks/useNavigator";
import { useSearch } from "hooks/useSearch";
import { useEffect, useState, useCallback, useMemo } from "react";
import { allFoods } from "@/data/foodData";
import { CSSGrid, layout } from "react-stonecutter";
import { FilterButton, FilterState, FoodTier } from "./Header/FilterButton";
import { ISortOption, SortButton } from "./Header/SortButton";
import { FoodCard } from "./FoodCard";
import { SelectedFoodsSection } from "./SelectedFoods";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { CalculateSection } from "./Calculate/CalculateSection";

const foods = Object.values(allFoods) as unknown as Food[];
export type SortOptionId = "total_nutrients" | "name" | "calories" | "weight" | "carb" | "fat" | "pro" | "vit";

const defaultFilters: FilterState = {
    tier: ["Tier-4"],
    type: [],
    sort: { id: "total_nutrients", label: "Total Nutrients", desc: true },
};

export const IndexContent = () => {
    const { setActivePage } = useNavigator();
    const { searchInput } = useSearch();
    const [activeFilters, setActiveFiltersState] = useState<FilterState | null>(null);
    const [showRest, setShowRest] = useState(false);
    const [selectedFoods, setSelectedFoods] = useState<Food[]>([]);
    const [componentLoaded, setComponentLoaded] = useState(false);
    useEffect(() => {
        const savedFilters = JSON.parse(localStorage.getItem("activeFilters") || "null");
        if (savedFilters) {
            setActiveFiltersState(savedFilters);
        } else {
            setActiveFiltersState(defaultFilters);
        }

        const savedSelectedFoods = JSON.parse(localStorage.getItem("selectedFoods") || "[]");
        if (savedSelectedFoods) {
            setSelectedFoods(savedSelectedFoods);
        }
        setComponentLoaded(true);
    }, []);
    useEffect(() => {
        setActivePage("home");
    }, [setActivePage]);

    useEffect(() => {
        if (componentLoaded) {
            localStorage.setItem("selectedFoods", JSON.stringify(selectedFoods));
        }
    }, [selectedFoods, componentLoaded]);

    const setActiveFilters = (filter: any) => {
        setShowRest(false);
        setActiveFiltersState(filter);
        window.localStorage.setItem("activeFilters", JSON.stringify(filter(activeFilters)));
    };

    const onFoodClicked = useCallback(
        (food: Food) => {
            if (!selectedFoods) return;
            if (selectedFoods.some((selFood) => selFood.id === food.id)) {
                setSelectedFoods((prev) => {
                    return prev.filter((f) => f.id !== food.id);
                });
            } else {
                setSelectedFoods((prev) => [...prev, food]);
            }
        },
        [selectedFoods]
    );

    const renderFoods = useCallback(() => {
        const activeSort = activeFilters?.sort;

        if (!activeSort) {
            return <div></div>;
        }
        const MAX_FOODS = 12;
        const renderUntil = showRest ? undefined : MAX_FOODS;
        if (searchInput.length > 0) {
            return foods
                .filter((food) => food.name.toLowerCase().includes(searchInput.toLowerCase()))
                .slice(0, MAX_FOODS)
                .map((food) => {
                    const active = selectedFoods.some((selFood) => selFood.id === food.id);
                    return (
                        <div
                            className="h-[140px] w-[240px]"
                            key={food.id}
                        >
                            <FoodCard
                                onFoodClick={onFoodClicked}
                                food={food}
                                selected={active}
                            />
                        </div>
                    );
                });
        }
        const filteredFoods = foods
            .filter((food) => {
                if (activeFilters.type.length > 0) {
                    return activeFilters.type.includes(food.type);
                }
                return true;
            })
            .filter((food) => {
                if (activeFilters.tier.length > 0) {
                    return activeFilters.tier.includes(("Tier-" + String(food.tier)) as unknown as FoodTier);
                }
                return true;
            });

        const sortedFoods = filteredFoods.sort((a, b) => {
            if (activeSort.id === "total_nutrients") {
                return b.carb + b.vit + b.fat + b.pro - (a.carb + a.vit + a.fat + a.pro);
            }
            if (activeSort.id === "name") {
                return a.name.localeCompare(b.name);
            }
            if (activeSort.id === "calories") {
                return b.cal - a.cal;
            }
            if (activeSort.id === "weight") {
                return b.weight - a.weight;
            }
            if (activeSort.id === "carb") {
                return b.carb - a.carb;
            }
            if (activeSort.id === "fat") {
                return b.fat - a.fat;
            }
            if (activeSort.id === "pro") {
                return b.pro - a.pro;
            }
            if (activeSort.id === "vit") {
                return b.vit - a.vit;
            }
            return 0;
        });
        const renderedFoods = sortedFoods.slice(0, renderUntil).map((food) => {
            const active = selectedFoods.some((selFood) => selFood.id === food.id);

            return (
                <div
                    className="h-[140px] w-[240px]"
                    key={food.id}
                >
                    <FoodCard
                        selected={active}
                        onFoodClick={onFoodClicked}
                        food={food}
                    />
                </div>
            );
        });

        if (filteredFoods.length > MAX_FOODS && !showRest) {
            renderedFoods.push(
                <div
                    key="showrestbutton"
                    className="my-10 flex h-52 w-full items-start justify-center"
                >
                    <button
                        type={"button"}
                        className="flex h-14 items-center justify-center rounded-xl p-6 text-base  dark:bg-purple-500/40"
                        onClick={() => setShowRest(true)}
                    >
                        Load more...
                    </button>
                </div>
            );
        }
        return renderedFoods;
    }, [
        activeFilters?.sort,
        activeFilters?.tier,
        activeFilters?.type,
        onFoodClicked,
        searchInput,
        showRest,
        selectedFoods,
    ]);

    const getFoods = useCallback<() => IFoods>(() => {
        const stomachFoods = JSON.parse(localStorage.getItem("stomachFoods") || "[]");
        return { selected: selectedFoods, stomach: stomachFoods };
    }, [selectedFoods]);

    const getFilters = useCallback(() => {
        return activeFilters;
    }, [activeFilters]);

    const removeFood = (food: Food) => {
        setSelectedFoods((prev) => prev.filter((f) => f.id !== food.id));
    };

    const addFood = (food: Food) => {
        setSelectedFoods((prev) => [...prev, food]);
    };

    return (
        <div className="flex h-full flex-1 flex-row overflow-hidden">
            <div
                id="foods_section"
                className="flex h-full w-1/3 min-w-[510px] flex-col border-r-2 border-r-primarydark-200/40"
            >
                <div className="flex h-16 w-full flex-shrink-0 flex-grow-0 flex-row  items-center border-b-2 border-primarydark-200/40 border-b-primarydark-500/60 px-6  text-primary-950 dark:bg-primarydark-600">
                    <div className="justify flex flex-grow flex-row items-center">
                        <div className="h-8 w-8 cursor-pointer text-3xl hover:text-primary-600">
                            <SortButton
                                filters={activeFilters}
                                setActiveFilters={setActiveFilters}
                            />
                        </div>
                        :
                        {activeFilters && (
                            <span className="mx-2 w-12 text-center leading-none">{activeFilters.sort.label}</span>
                        )}
                    </div>
                    <div className=" h-8 w-8 cursor-pointer  text-center text-3xl hover:text-primary-600">
                        <FilterButton
                            filters={activeFilters}
                            setFilters={setActiveFilters}
                        />
                    </div>
                </div>
                <SimpleBar className="hidescrollbar h-full flex-shrink flex-grow">
                    <div className=" flex-grow-1 flex w-full flex-col items-center    pt-5 pb-10">
                        {/*@ts-ignore-next-line */}
                        <CSSGrid
                            component="div"
                            columns={2}
                            columnWidth={240}
                            itemHeight={140}
                            gutterWidth={5}
                            gutterHeight={5}
                            layout={layout.simple}
                            duration={150}
                        >
                            {renderFoods()}
                        </CSSGrid>
                    </div>
                </SimpleBar>
            </div>
            <div className="flex h-full min-w-[400px] flex-col border-r-2 border-r-primarydark-200/40">
                <div className="flex h-16 w-full flex-shrink-0 flex-grow-0 flex-row items-center justify-center border-b-2 border-primarydark-200/40 border-b-primarydark-500/60 px-6  text-primary-950 dark:bg-primarydark-600">
                    <span className="font-[Cubano] text-2xl  text-ecored-300/80">Selected Foods</span>
                </div>
                <SelectedFoodsSection
                    selectedFoods={selectedFoods}
                    removeFood={removeFood}
                />
            </div>
            <div className="flex h-full min-w-[400px] flex-1 flex-col border-r-2 border-r-primarydark-200/40">
                <CalculateSection getFoods={getFoods} />
            </div>
        </div>
    );
};

/*
<FaChevronDown className=" mt-5 h-7 w-full justify-self-end text-center text-2xl text-primarydark-100" />
*/
