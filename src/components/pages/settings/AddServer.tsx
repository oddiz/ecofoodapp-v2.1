import { useServerStore } from "@/store/useServerStore";
import type { EcoServer } from "@/types/server";
import { getFoodsFromAPI } from "@/utils/getServerFoods";
import { getFoodShopsFromAPI } from "@/utils/getServerFoodShops";
import { sanitizeUrl } from "@/utils/sanitizeUrl";
import { Button, Input } from "@headlessui/react";
import { useState } from "react";
import { FaDeleteLeft } from "react-icons/fa6";
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
    name: "Silverleaf",
    address: "209.222.98.135:3001",
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
  const ServerPresetBadge = ({ server }: { server: EcoServer }) => {
    return (
      <span
        onClick={() => {
          setNewServerName(server.name);
          setNewServerIP(server.address);
        }}
        className="bg-ecoyellow-700 cursor-pointer text-white text-xs rounded-full px-2 py-1"
      >
        {server.name}
      </span>
    );
  };
  return (
    <div className="flex flex-row my-5  ">
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
            placeholder="Server IP - 1.2.3.4:port"
            className="mb-2 w-full h-10 px-2 bg-primarydark-300 focus:bg-primarydark-200 focus:ring-0 rounded-lg focus:outline-none  max-w-xs"
          />
          <Button
            className=" bg-ecoblue-600 w-24 h-10 rounded-md"
            onClick={handleAddServer}
          >
            {serverLoading ? "Loading" : "Add Server"}
          </Button>
          {availableServers.map((server: EcoServer) => (
            <div key={server.address} className="flex flex-row space-x-2">
              <button
                onClick={() => setCurrentServer(server)}
                className={`mr-2 rounded-lg ${server.address === currentServer.address ? "bg-green-500" : "bg-gray-500"} px-4 py-2 text-black`}
              >
                {server.name}
              </button>

              <FaDeleteLeft
                size={28}
                onClick={() => removeServer(server)}
                className="cursor-pointer mr-2 rounded-lg text-ecored-300 text-xs self-center "
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col my-5  px-10">
        <h2 className="mb-2 text-xl font-semibold ">Presets</h2>
        <div className="mb-2 flex flex-col space-y-2">
          {PREFILLED_SERVERS.map((server: EcoServer) => (
            <ServerPresetBadge key={server.name} server={server} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddServerComponent;
