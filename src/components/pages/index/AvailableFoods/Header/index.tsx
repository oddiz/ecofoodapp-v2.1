import { FilterButton } from "@/components/pages/index/AvailableFoods/Header/FilterButton";
import { SortButton } from "@/components/pages/index/AvailableFoods/Header/SortButton";
import { useStore } from "@/store/useStore";
import React from "react";

const FoodsHeader = React.memo(function FoodsHeader() {
  return (
    <div className="border-primarydark-200/40 border-b-primarydark-500/60 text-primary-950 bg-primarydark-600 flex h-16 w-full flex-shrink-0 flex-grow-0 flex-row items-center border-b-2 px-6">
      <div className="justify flex flex-grow flex-row items-center">
        <SortButton />
        <span className="mx-2 w-12 text-center leading-none">
          {useStore((state) => state.activeFilters.sort.label)}
        </span>
      </div>
      <FilterButton />
    </div>
  );
});

export default FoodsHeader;
