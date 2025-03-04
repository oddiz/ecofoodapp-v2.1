// filepath: /src/pages/shopping.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useServerStore } from "@/store/useServerStore";
import { useShoppingStore } from "@/store/useShoppingStore";
import type { Food } from "@/types/food";
import { Trash2, ShoppingCart, Plus, Minus } from "lucide-react";
import ShoppingMap from "@/components/pages/shopping/ShoppingMap";
import { ShopNameColorParser } from "@/components/ShopName";

export interface BestDeal {
  item: string;
  shop: {
    shopName: string;
    price: number;
    shopQuantity: number;
    coordinates?: [number, number];
  };
  quantity: number;
  price: number;
}
export default function ShoppingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [newQuantity, setNewQuantity] = useState(1);
  const [filteredItems, setFilteredItems] = useState<Food[]>([]);

  // Shopping store
  const {
    shoppingList,
    addToShoppingList,
    removeFromShoppingList,
    updateQuantity: updateItemQuantity,
    clearShoppingList,
    getTotalCost,
  } = useShoppingStore();

  // Server store
  const { getCurrentFoods } = useServerStore();

  // Filter foods based on search term
  useEffect(() => {
    const filtered = getCurrentFoods().filter((food) =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredItems(filtered);
  }, [searchTerm, getCurrentFoods]);

  // Calculate best deals based on shopping list
  const bestDeals = useMemo(() => {
    return shoppingList.map((item) => {
      // Find all shops selling this item, with their prices
      const bestShop = item.shops
        .filter((shop) => shop.shopQuantity > 0)
        .sort((a, b) => a.price - b.price)[0];
      return {
        item: item.food.name,
        shop: bestShop,
        quantity: bestShop?.shopQuantity ?? 0,
        price: bestShop?.price ?? 0,
      } as BestDeal;
    });
  }, [shoppingList]);

  return (
    <div className="flex flex-col h-full bg-primarydark-800 text-primary-200 p-4 space-y-6 overflow-y-auto">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-primarydark-700 border-primarydark-400"
            onClick={clearShoppingList}
          >
            <Trash2 className="h-4 w-4 text-ecored-400" />
            <span>Clear List</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column: Add items and list */}
        <div className="space-y-4 lg:col-span-2">
          <div className="p-4 bg-primarydark-700 rounded-lg border border-primarydark-500/40 shadow-md">
            <div className="flex justify-between ">
              <h2 className="text-xl font-semibold mb-4 text-primary-100">
                Add Items
              </h2>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-primarydark-700 border-primarydark-400"
                onClick={clearShoppingList}
              >
                <Trash2 className="h-4 w-4 text-ecored-400" />
                <span>Clear All</span>
              </Button>
            </div>
            <div className="flex space-x-2">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for food items"
                className="flex-grow bg-primarydark-600 border-primarydark-400 caret-primary-400"
              />
              <Input
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(Number(e.target.value))}
                min={1}
                className="w-24 bg-primarydark-600 border-primarydark-400"
                placeholder="Qty"
              />
            </div>

            {searchTerm && filteredItems.length > 0 && (
              <div className="mt-2 max-h-60 overflow-y-auto bg-primarydark-800 rounded-md border border-primarydark-600">
                {filteredItems.slice(0, 7).map((food) => (
                  <button
                    key={food.id}
                    onClick={() => {
                      addToShoppingList(food, newQuantity);
                      setSearchTerm("");
                    }}
                    className="flex justify-between items-center w-full p-2 hover:bg-primarydark-600 border-b border-primarydark-600 last:border-0 text-left"
                  >
                    <span>{food.name}</span>
                    <Plus className="h-4 w-4 text-ecogreen-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-row space-x-4">
            <div className="bg-primarydark-700 rounded-lg border border-primarydark-500/40 shadow-md overflow-hidden flex-1 ">
              <div className="p-4 border-b border-primarydark-600 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-primary-100">
                  Your Shopping List
                </h2>
                <span className="text-ecogreen-400 font-semibold">
                  Total: ${getTotalCost().toFixed(2)}
                </span>
              </div>

              {shoppingList.length === 0 ? (
                <div className="p-8 text-center text-primary-400">
                  <ShoppingCart className="h-12 w-12 mx-auto opacity-50 mb-2" />
                  <p>Your shopping list is empty</p>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-primarydark-600">
                    <TableRow>
                      <TableHead className="text-primary-300">Item</TableHead>
                      <TableHead className="text-primary-300">
                        Quantity
                      </TableHead>
                      <TableHead className="text-primary-300">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shoppingList.map((item) => (
                      <TableRow
                        key={item.food.id}
                        className="border-b border-primarydark-600 hover:bg-primarydark-600/50"
                      >
                        <TableCell className="font-medium">
                          {item.food.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0 bg-primarydark-600"
                              onClick={() =>
                                updateItemQuantity(
                                  item.food.id,
                                  Math.max(1, item.quantity - 1),
                                )
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span>{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0 bg-primarydark-600"
                              onClick={() =>
                                updateItemQuantity(
                                  item.food.id,
                                  item.quantity + 1,
                                )
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="hover:bg-ecored-600/20 hover:text-ecored-400"
                            onClick={() => removeFromShoppingList(item.food.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
            {shoppingList.length > 0 && (
              <div className="bg-primarydark-700 rounded-lg border border-primarydark-500/40 shadow-md overflow-hidden flex-1 min-w-72">
                <div className="p-4 border-b border-primarydark-600">
                  <h2 className="text-xl font-semibold text-primary-100">
                    Best Deals
                  </h2>
                </div>

                <div className=" overflow-auto">
                  <Table>
                    <TableHeader className="bg-primarydark-600">
                      <TableRow>
                        <TableHead className="text-primary-300">Item</TableHead>
                        <TableHead className="text-primary-300">
                          Shops
                        </TableHead>
                        <TableHead className="text-primary-300 text-right">
                          Price
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bestDeals.map((deal, index) => (
                        <TableRow
                          key={index}
                          className="border-b border-primarydark-600 hover:bg-primarydark-600/50"
                        >
                          <TableCell className="font-medium">
                            {deal.item}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <Badge
                                  variant="outline"
                                  className="bg-primarydark-600 border-primarydark-400"
                                >
                                  {deal.shop?.shopName && (
                                    <ShopNameColorParser
                                      name={deal.shop.shopName}
                                    />
                                  )}
                                </Badge>
                                <span className="text-xs text-primary-400">
                                  {deal.quantity} @ ${deal.price.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-ecogreen-400">
                            ${deal.price.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Best deals and map */}
        <div className="space-y-6">
          <ShoppingMap bestDeals={bestDeals} />
        </div>
      </div>
    </div>
  );
}

// Export the legacy component name for backwards compatibility
export const ShoppingList = ShoppingPage;
