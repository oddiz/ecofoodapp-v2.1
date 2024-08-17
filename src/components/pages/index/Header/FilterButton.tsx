import { Popover, Switch } from "@headlessui/react";
import { FaFilter } from "react-icons/fa";
import { useState, Dispatch, SetStateAction } from "react";
import { FoodType } from "@/types/food";
import { ISortOption } from "./SortButton";

export type FoodTier = "Tier-4" | "Tier-3" | "Tier-2" | "Tier-1" | "Tier-0";

export type FilterState = {
    tier: FoodTier[];
    type: FoodType[];
    sort: ISortOption;
};
export function FilterButton({
    filters,
    setFilters,
}: {
    filters: FilterState | null;
    setFilters: Dispatch<SetStateAction<FilterState>>;
}) {
    const allTierFilters: FoodTier[] = ["Tier-4", "Tier-3", "Tier-2", "Tier-1", "Tier-0"];
    const allTypeFilters: FoodType[] = ["Stove", "Cast Iron Stove", "Kitchen", "Bakery", "Campfire", "Raw"];

    return (
        <Popover className="relative">
            <Popover.Button>
                <FaFilter />
            </Popover.Button>

            <Popover.Panel className="absolute z-10 text-primary-600">
                <div className="flex w-40 flex-col rounded-xl text-lg dark:bg-primarydark-100">
                    <header className="flex h-12 items-center border-b-2 pl-4 dark:border-b-primarydark-300">
                        Tier:
                    </header>
                    <div className="flex w-full flex-col p-2">
                        {allTierFilters.map((type: FoodTier) => {
                            return (
                                <TierFilterButton
                                    key={type}
                                    filters={filters}
                                    setFilters={setFilters}
                                    label={type}
                                />
                            );
                        })}
                    </div>
                    <header className="flex h-12 items-center border-b-2 pl-4 dark:border-b-primarydark-300">
                        Type:
                    </header>
                    <div className="flex w-full flex-col p-2">
                        {allTypeFilters.map((type: FoodType) => {
                            return (
                                <TypeFilterButton
                                    key={type}
                                    filters={filters}
                                    setFilters={setFilters}
                                    label={type}
                                />
                            );
                        })}
                    </div>
                </div>
            </Popover.Panel>
        </Popover>
    );
}

function TypeFilterButton({
    label,
    filters,
    setFilters,
}: {
    setFilters: Dispatch<SetStateAction<FilterState>>;
    filters: FilterState | null;
    label: FoodType;
}) {
    const [enabled, setEnabled] = useState(filters?.type.includes(label) || false);

    function handleChange() {
        setEnabled(!enabled);
        if (enabled) {
            setFilters((prev) => ({
                ...prev,
                type: prev.type.filter((type) => type !== label),
            }));
        } else {
            setFilters((prev) => ({
                ...prev,
                type: [...prev.type, label],
            }));
        }
    }
    return (
        <div
            key={label}
            className="flex h-9 flex-row items-center  "
        >
            <Switch
                className={`${
                    enabled ? "bg-ecogreen-500" : "bg-primary-900"
                } relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full`}
                checked={enabled}
                onChange={handleChange}
            >
                <span
                    className={`${
                        enabled ? "translate-x-5" : "translate-x-1"
                    } inline-block h-3 w-3 transform rounded-full bg-white transition`}
                />
            </Switch>
            <div className="flex w-full justify-start pl-4 text-base">
                {label === "Cast Iron Stove" ? "Cast Iron" : label}
            </div>
        </div>
    );
}
function TierFilterButton({
    label,
    filters,
    setFilters,
}: {
    setFilters: Dispatch<SetStateAction<FilterState>>;
    filters: FilterState | null;
    label: FoodTier;
}) {
    const [enabled, setEnabled] = useState(filters?.tier.includes(label) || false);

    function handleChange() {
        setEnabled(!enabled);
        if (enabled) {
            setFilters((prev) => ({
                ...prev,
                tier: prev.tier.filter((tier) => tier !== label),
            }));
        } else {
            setFilters((prev) => ({
                ...prev,
                tier: [...prev.tier, label],
            }));
        }
    }
    return (
        <div
            key={label}
            className="flex h-9  flex-row items-center "
        >
            <Switch
                className={`${
                    enabled ? "bg-ecogreen-500" : "bg-primary-900"
                } relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full`}
                checked={enabled}
                onChange={handleChange}
            >
                <span
                    className={`${
                        enabled ? "translate-x-5" : "translate-x-1"
                    } inline-block h-3 w-3 transform rounded-full bg-white transition`}
                />
            </Switch>
            <div className=" flex w-full justify-center">{label.replace("-", " ")}</div>
        </div>
    );
}
