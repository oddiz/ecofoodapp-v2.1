import { useServerStore } from "@/store/useServerStore";
import { Button } from "@headlessui/react";
import { RefreshCw, RotateCcw } from "lucide-react";

type ShopHeaderProps = {
  onResetBlacklists: () => void;
};

export default function ShopHeader({ onResetBlacklists }: ShopHeaderProps) {
  const { currentServer, setCurrentServer, getLastRefresh } = useServerStore();

  const handleRefresh = () => {
    setCurrentServer(currentServer).catch((e) => {
      console.error("Failed to refresh shops", e);
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2  bg-primarydark-600 shadow-black/30 shadow-inner">
      <div className="flex items-center gap-2">
        <Button
          onClick={handleRefresh}
          className="flex items-center gap-2 text-primary-800"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Shops</span>
        </Button>

        <Button
          onClick={onResetBlacklists}
          className="flex items-center gap-2 text-primary-800"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset Blacklists</span>
        </Button>
      </div>

      <div className="text-sm text-primary-800 text-muted-foreground">
        {getLastRefresh() ? (
          <span>
            Last refreshed: {new Date(getLastRefresh()!).toDateString() || ""}
          </span>
        ) : (
          <span>Not refreshed yet</span>
        )}
      </div>
    </div>
  );
}
