import { useFoodStore } from "@/store/useFoodStore";
import { useFoodFilter } from "@/hooks/useFoodFilter";
import { type Food } from "@/types/food";
import FoodsHeader from "@/components/pages/Calculator/AvailableFoods/Header";
import FoodGrid from "@/components/pages/Calculator/AvailableFoods/FoodGrid";
import SelectedFoodsSection from "@/components/pages/Calculator/SelectedFoods";
import CalculateSection from "@/components/pages/Calculator/CalculateSection";

const CalculatorContent = () => {
  const {
    selectedFoods,
    addSelectedFood: addFood,
    removeSelectedFood: removeFood,
  } = useFoodStore();
  const availableFoods = useFoodFilter();

  const croppedFoods = availableFoods;

  const onFoodClicked = (food: Food) => {
    if (selectedFoods.some((selFood) => selFood.id === food.id)) {
      removeFood(food);
    } else {
      addFood(food);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full overflow-hidden">
      {/* Foods Grid Section - Full width on mobile, 2/3 on desktop */}
      <div
        id="foods_section"
        className="flex flex-col border-b-2 lg:border-b-0 lg:border-r-2 border-primarydark-200/40
                   w-full lg:w-2/3 h-[50vh] lg:h-full overflow-y-auto"
      >
        <FoodsHeader />
        <FoodGrid
          foods={croppedFoods}
          onFoodClicked={onFoodClicked}
          selectedFoods={selectedFoods}
        />
      </div>

      {/* Right sidebar - Selected foods & Calculate */}
      <div className="flex flex-col w-full lg:w-1/3 h-[50vh] lg:h-full overflow-y-auto">
        {/* Selected Foods Section */}
        <div className="flex-grow overflow-hidden">
          <SelectedFoodsSection
            selectedFoods={selectedFoods}
            removeFood={removeFood}
          />
        </div>

        {/* Calculate Section */}
        <div className="flex-shrink-0">
          <CalculateSection />
        </div>
      </div>
    </div>
  );
};

export default CalculatorContent;
