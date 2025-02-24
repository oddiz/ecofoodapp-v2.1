import { useServerStore } from "@/store/useServerStore";
import type { EcoServer } from "@/types/server";
import { getServerFoods } from "@/utils/getServerFoods";
import { getServerFoodShops } from "@/utils/getServerFoodShops";
import { Button, Input } from "@headlessui/react";
import { useState } from "react";
import { toast } from "sonner";

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
  const [, setServerLoading] = useState(false);

  const handleAddServer = async () => {
    setServerLoading(true);
    if (!newServerName || !newServerIP) {
      toast("Please fill in all fields");
      return;
    }
    try {
      const server: EcoServer = { name: newServerName, address: newServerIP };
      const serverFoods = await getServerFoods(newServerIP);
      const serverShops = await getServerFoodShops(newServerIP, serverFoods);
      addServer(server, serverFoods, serverShops);
      setCurrentServer(server);
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
    <div className="flex flex-col my-5  ">
      <h2 className="mb-2 text-xl font-semibold ">Servers</h2>
      <div className="mb-2 flex flex-col space-y-2">
        <Input
          value={newServerName}
          onChange={(e) => setNewServerName(e.target.value)}
          placeholder="Server Name"
          className="mb-2 w-full h-10 px-2 bg-primarydark-300 focus:bg-primarydark-200 focus:ring-0 rounded-lg focus:outline-none  max-w-xs"
        />
        <Input
          value={newServerIP}
          onChange={(e) => setNewServerIP(e.target.value)}
          placeholder="Server IP"
          className="mb-2 w-full h-10 px-2 bg-primarydark-300 focus:bg-primarydark-200 focus:ring-0 rounded-lg focus:outline-none  max-w-xs"
        />
        <Button onClick={handleAddServer}>Add Server</Button>
        {availableServers.map((server: EcoServer) => (
          <div key={server.address} className="flex flex-row space-x-2">
            <div>
              <button
                onClick={() => setCurrentServer(server)}
                className={`mr-2 rounded-lg ${server.address === currentServer.address ? "bg-green-500" : "bg-gray-500"} px-4 py-2 text-black`}
              >
                {server.name}
              </button>
              <button
                onClick={() => removeServer(server)}
                className="mr-2 rounded-lg bg-red-500 px-4 py-2 text-black"
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddServerComponent;
