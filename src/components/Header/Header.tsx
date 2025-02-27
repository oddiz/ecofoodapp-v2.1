import { Search } from "./Search";
import { FaServer } from "react-icons/fa6";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useServerStore } from "@/store/useServerStore";
import { TbFidgetSpinner } from "react-icons/tb";

export const Header = () => {
  const currentServer = useServerStore((state) => state.currentServer);
  const servers = useServerStore((state) => state.availableServers);
  const setCurrentServer = useServerStore((state) => state.setCurrentServer);
  const serverLoading = useServerStore((state) => state.serverLoading);
  return (
    <header className="flex h-24 w-full flex-shrink-0 flex-row  py-5 px-5  bg-primarydark-650">
      <Search className="h-full flex-grow" />
      <div className="flex h-full flex-row items-center justify-end">
        <Popover>
          <PopoverButton className="h-full flex flex-row items-center justify-center text-primary-700 hover:text-primary-400">
            {serverLoading && (
              <div className="animate-spin origin-center duration-500 ">
                <TbFidgetSpinner size={24} />
              </div>
            )}
            <div className="m-3">{currentServer.name}</div>
            <FaServer size={24} />
          </PopoverButton>

          <PopoverPanel
            anchor="top end"
            transition
            className="divide-y  divide-white/5 rounded-xl bg-primarydark-700 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0 p-4"
          >
            <div className="text-primary-100 text-lg font-[Cubano]">
              Available Servers
            </div>
            {servers.map((server) => (
              <div
                key={server.name}
                className={`block text-base text-primary-400 ${
                  server.name === currentServer.name
                    ? "text-ecogreen-400 "
                    : "hover:text-primary-200"
                }`}
              >
                <button onClick={() => setCurrentServer(server)}>
                  <div>{server.name}</div>
                </button>
              </div>
            ))}
          </PopoverPanel>
        </Popover>
      </div>
    </header>
  );
};
