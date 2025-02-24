import ShopCard from "@/components/pages/shops/shopCard";
import { useSearch } from "@/hooks/useSearch";
import { useServerStore } from "@/store/useServerStore";

export default function ShopPage() {
  const { currentServerStores } = useServerStore((state) => state);
  const { searchInput } = useSearch();
  if (currentServerStores.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">
          To see the shops go to settings and add a server with its IP
        </h1>
        <div className="text-left m-4">
          <p>
            Only servers with Price Calculator plugin enabled will work with
            this feature.
          </p>
          <p>
            To find the server IP press G, or press the graph button ingame on
            bottom right and open the website.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 overflow-y-auto p-2">
      {currentServerStores
        .filter(
          (shop) =>
            shop.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            shop.foodsForSale.some((food) =>
              food.name.toLowerCase().includes(searchInput.toLowerCase()),
            ) ||
            shop.owner.toLowerCase().includes(searchInput.toLowerCase()),
        )
        .map((shop) => (
          <ShopCard key={shop.name} shop={shop} />
        ))}
    </div>
  );
}
