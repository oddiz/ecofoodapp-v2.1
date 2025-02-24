import ShopCard from "@/components/pages/shops/shopCard";
import { useServerStore } from "@/store/useServerStore";

export default function ShopPage() {
  const { currentServerStores } = useServerStore((state) => state);

  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 overflow-y-auto p-2">
      {currentServerStores.map((shop) => (
        <ShopCard key={shop.name} shop={shop} />
      ))}
    </div>
  );
}
