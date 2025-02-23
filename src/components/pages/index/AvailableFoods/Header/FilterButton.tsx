import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Switch,
} from "@headlessui/react";
import { FaFilter } from "react-icons/fa";
import { useCallback, useState } from "react";
import { type FoodTier, type FoodType } from "@/types/food";
import { useStore } from "@/store/useStore";

export function FilterButton() {
  const allTierFilters: FoodTier[] = [
    "Tier-4",
    "Tier-3",
    "Tier-2",
    "Tier-1",
    "Tier-0",
  ];
  const allTypeFilters: FoodType[] = [
    "Stove",
    "Cast Iron Stove",
    "Kitchen",
    "Bakery",
    "Campfire",
    "Raw",
  ];

  return (
    <Popover className="relative">
      <PopoverButton>
        <FaFilter />
      </PopoverButton>

      <PopoverPanel className="text-primary-600 absolute z-10">
        <div className="bg-primarydark-100 flex w-40 flex-col rounded-xl text-lg">
          <header className="border-b-primarydark-300 flex h-12 items-center border-b-2 pl-4">
            Tier:
          </header>
          <div className="flex w-full flex-col p-2">
            {allTierFilters.map((type: FoodTier) => {
              return <TierFilterButton key={type} label={type} />;
            })}
          </div>
          <header className="border-b-primarydark-300 flex h-12 items-center border-b-2 pl-4">
            Type:
          </header>
          <div className="flex w-full flex-col p-2">
            {allTypeFilters.map((type: FoodType) => {
              return <TypeFilterButton key={type} label={type} />;
            })}
          </div>
        </div>
      </PopoverPanel>
    </Popover>
  );
}

function TypeFilterButton({ label }: { label: FoodType }) {
  const filters = useStore((state) => state.activeFilters);
  const setFilters = useStore((state) => state.setActiveFilters);
  const [enabled, setEnabled] = useState(
    filters?.type.includes(label) ?? false,
  );

  function handleChange() {
    setEnabled(!enabled);
    if (enabled) {
      setFilters({
        ...filters,
        type: filters.type.filter((type) => type !== label),
      });
    } else {
      setFilters({
        ...filters,
        type: [...filters.type, label],
      });
    }
  }
  return (
    <div key={label} className="flex h-9 flex-row items-center">
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
function TierFilterButton({ label }: { label: FoodTier }) {
  const activeFilters = useStore((state) => state.activeFilters);
  const setFilters = useStore((state) => state.setActiveFilters);
  const [enabled, setEnabled] = useState(
    activeFilters.tier.includes(label) ?? false,
  );

  const handleChange = useCallback(() => {
    setEnabled(!enabled);
    if (enabled) {
      setFilters({
        ...activeFilters,
        tier: activeFilters.tier.filter((tier) => tier !== label),
      });
    } else {
      setFilters({
        ...activeFilters,
        tier: [...activeFilters.tier, label],
      });
    }
  }, [activeFilters, enabled, label, setFilters]);
  return (
    <div key={label} className="flex h-9 flex-row items-center">
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
      <div className="flex w-full justify-center">
        {label.replace("-", " ")}
      </div>
    </div>
  );
}
