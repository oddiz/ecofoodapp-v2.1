import { FilterButton } from "@/components/pages/index/AvailableFoods/Header/FilterButton";
import { SortButton } from "@/components/pages/index/AvailableFoods/Header/SortButton";
import React from "react";

const FoodsHeader = React.memo(function FoodsHeader() {
  return (
    <div className="border-primarydark-200/40 border-b-primarydark-500/60 text-primary-950 bg-primarydark-600 flex h-16 w-full flex-shrink-0 flex-grow-0 flex-row items-center border-b-2 px-6">
      <div className="justify flex flex-grow flex-row items-center">
        <SortButton />
      </div>
      <FilterButton />
    </div>
  );
});

export default FoodsHeader;
