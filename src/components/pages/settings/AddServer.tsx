import { Badge } from "@/components/ui/badge";
import SparklyBadgeButton from "@/components/ui/shinybadge";
import {
  TableBody,
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useServerStore } from "@/store/useServerStore";
import type { EcoServer } from "@/types/server";
import { getFoodsFromAPI } from "@/utils/getServerFoods";
import { getFoodShopsFromAPI } from "@/utils/getServerFoodShops";
import { sanitizeUrl } from "@/utils/sanitizeUrl";
import { Button, Input } from "@headlessui/react";
import { Check, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PREFILLED_SERVERS: EcoServer[] = [
  {
    name: "White Tiger",
    address: "white-tiger.play.eco",
  },
  {
    name: "Sunset Isle",
    address: "135.131.96.179:3005",
  },

  {
    name: "Lotus Eco",
    address: "78.46.87.6:3001",
  },
  {
    name: "Greenleaf",
    address: "148.251.154.60:3021",
  },
  {
    name: "SilverMoon",
    address: "silvermoon.play.eco",
  },
];

const AddServerComponent = () => {
  const {
    availableServers,
    addServer,
    removeServer,
    setCurrentServer,
    currentServer,
  } = useServerStore();
  const [newServerName, setNewServerName] = useState("");
  const [newServerIP, setNewServerIP] = useState("");
  const [serverLoading, setServerLoading] = useState(false);

  const handleAddServer = async () => {
    setServerLoading(true);
    try {
      if (!newServerName || !newServerIP) {
        toast("Please fill in all fields");
        return;
      }
      const server: EcoServer = {
        name: newServerName,
        address: sanitizeUrl(newServerIP),
      };
      const serverFoods = await getFoodsFromAPI(sanitizeUrl(newServerIP));
      const serverShops = await getFoodShopsFromAPI(
        sanitizeUrl(newServerIP),
        serverFoods,
      );
      addServer(server, serverFoods, serverShops);
      await setCurrentServer(server);
      toast("Server added successfully");
    } catch (error) {
      console.error(error);
      toast("Failed to add server");
    } finally {
      setServerLoading(false);
    }
    setServerLoading(false);
  };

  return (
    <div className="flex flex-col my-5">
      <h2 className="mb-2 text-xl font-semibold">Servers</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Server Form */}
        <div className="p-4 bg-primarydark-700 rounded-lg border border-primarydark-500/40 shadow-md">
          <h3 className="text-lg font-medium mb-4 text-primary-100">
            Add New Server
          </h3>
          <div className="space-y-4">
            <Input
              value={newServerName}
              onChange={(e) => setNewServerName(e.target.value)}
              placeholder="Server Name"
              className="w-full h-10 px-2 bg-primarydark-300 focus:bg-primarydark-200 focus:ring-0 rounded-lg focus:outline-none"
            />
            <Input
              value={newServerIP}
              onChange={(e) => setNewServerIP(e.target.value)}
              placeholder="Server IP - 1.2.3.4:port"
              className="w-full h-10 px-2 bg-primarydark-300 focus:bg-primarydark-200 focus:ring-0 rounded-lg focus:outline-none"
            />
            <Button
              className="bg-ecoblue-600 w-full h-10 rounded-md"
              onClick={handleAddServer}
            >
              {serverLoading ? "Loading..." : "Add Server"}
            </Button>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2 text-primary-100">
              Presets
            </h3>
            <div className="flex flex-wrap gap-2">
              <SparklyBadgeButton
                color="pink"
                onClick={() => {
                  setNewServerName("Silverleaf");
                  setNewServerIP("209.222.98.135:3001");
                }}
                size="sm"
                label="Silverleaf"
              />
              {PREFILLED_SERVERS.map((server: EcoServer) => (
                <span
                  key={server.name}
                  onClick={() => {
                    setNewServerName(server.name);
                    setNewServerIP(server.address);
                  }}
                  className="bg-ecoyellow-700 cursor-pointer text-white text-xs rounded-full px-2 py-1"
                >
                  {server.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Server List Table - Using shadcn style */}
        <div className="col-span-1 lg:col-span-2 bg-primarydark-700 rounded-lg border border-primarydark-500/40 shadow-md overflow-hidden">
          <div className="p-4 border-b border-primarydark-600">
            <h3 className="text-lg font-medium text-primary-100">
              Your Servers
            </h3>
          </div>

          {availableServers.length === 0 ? (
            <div className="p-8 text-center text-primary-400">
              <p>No servers added yet</p>
              <p className="text-sm mt-1">
                Add a server using the form or select a preset
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-primarydark-800">
                  <TableRow>
                    <TableHead className="text-primary-300">Server</TableHead>
                    <TableHead className="text-primary-300">Address</TableHead>
                    <TableHead className="text-primary-300 text-center">
                      Foods
                    </TableHead>
                    <TableHead className="text-primary-300 text-center">
                      Shops
                    </TableHead>
                    <TableHead className="text-primary-300">
                      Last Updated
                    </TableHead>
                    <TableHead className="text-primary-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableServers.map((server: EcoServer) => {
                    // Get server data from the store
                    const foods =
                      useServerStore.getState().serverFoods[server.address] ??
                      [];
                    const shops =
                      useServerStore.getState().serverShops[server.address] ??
                      [];
                    const lastRefresh =
                      useServerStore.getState().lastRefreshList?.[
                        server.address
                      ];
                    const isActive = server.address === currentServer.address;

                    return (
                      <TableRow
                        key={server.address}
                        className={`border-b border-primarydark-600 ${isActive ? "bg-primarydark-600/30" : ""} hover:bg-primarydark-600/50`}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {server.name}
                            {isActive && (
                              <Badge className="bg-ecogreen-600 text-primary-100">
                                Active
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-primary-400">
                          {server.address}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className="bg-primarydark-600"
                          >
                            {foods.length}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className="bg-primarydark-600"
                          >
                            {shops.length}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-primary-400">
                          {lastRefresh
                            ? new Date(lastRefresh).toLocaleString()
                            : "Never"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setCurrentServer(server)}
                              disabled={isActive}
                              className={`p-1 rounded ${
                                isActive
                                  ? "bg-primarydark-500 cursor-not-allowed"
                                  : "bg-ecoblue-600 hover:bg-ecoblue-500"
                              }`}
                              title={
                                isActive
                                  ? "Current server"
                                  : "Set as active server"
                              }
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => removeServer(server)}
                              className="p-1 rounded bg-ecored-600 hover:bg-ecored-500"
                              title="Remove server"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddServerComponent;
