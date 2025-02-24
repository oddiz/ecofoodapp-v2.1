import AddServerComponent from "@/components/pages/settings/AddServer";
import type { NextPage } from "next";

const Settings: NextPage = () => {
  return (
    <div className="caret-slate-100 flex flex-col justify-center min-w-[600px] max-w-[800px] mx-auto">
      <AddServerComponent />
    </div>
  );
};

export default Settings;
