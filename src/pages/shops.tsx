import ShopCard from "@/components/pages/shops/shopCard";
import ShopHeader from "@/components/pages/shops/ShopHeader";
import { useSearch } from "@/hooks/useSearch";
import { useServerStore } from "@/store/useServerStore";
import type { FoodShop } from "@/types/shops";
import { useCallback, useEffect, useState } from "react";
import { ImSpinner } from "react-icons/im";

export default function ShopPage() {
  const { searchInput } = useSearch();
  const {
    currentServerStores,
    getServerBlacklist,
    setServerBlacklist,
    resetServerBlacklist,
    serverLoading,
  } = useServerStore();
  const [shopList, setShopList] = useState<FoodShop[]>([]);
  useEffect(() => {
    if (currentServerStores.length > 0) {
      setShopList(currentServerStores);
    }
  }, [currentServerStores]);

  useEffect(() => {
    const filteredShops = currentServerStores
      .filter((shop) => !getServerBlacklist().includes(shop.name))
      .filter(
        (shop) =>
          shop.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          shop.foodsForSale.some((food) =>
            food.name.toLowerCase().includes(searchInput.toLowerCase()),
          ) ||
          shop.owner.toLowerCase().includes(searchInput.toLowerCase()),
      );
    setShopList(filteredShops);
  }, [currentServerStores, getServerBlacklist, searchInput]);

  const handleResetBlacklists = useCallback(() => {
    resetServerBlacklist();
  }, [resetServerBlacklist]);
  const handleBlacklistShop = useCallback(
    (shopName: string) => {
      setServerBlacklist(shopName);
    },
    [setServerBlacklist],
  );

  if (serverLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <ImSpinner
          size={54}
          className="animate-spin h-24 w-24 
          text-primary-500"
        />
      </div>
    );
  }

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
  // Filter shops based on search and blacklist

  return (
    <div className="flex flex-col h-full">
      <ShopHeader onResetBlacklists={handleResetBlacklists} />

      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 overflow-y-auto p-2">
        {shopList.map((shop) => (
          <ShopCard
            key={shop.name}
            shop={shop}
            onBlacklist={() => handleBlacklistShop(shop.name)}
          />
        ))}
      </div>
    </div>
  );
}
