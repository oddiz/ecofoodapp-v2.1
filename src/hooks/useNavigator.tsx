import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";

export type ContextData = {
  activePage: string;
  setActivePage: (value: string) => void;
};
export const NavContext = createContext<ContextData>({
  activePage: "",
  setActivePage: (value: string) => {
    return value;
  },
});

export const useNavigator = () => {
  const { activePage, setActivePage } = useContext(NavContext);
  const router = useRouter();

  useEffect(() => {
    setActivePage(router.pathname);
  }, [router.pathname, setActivePage]);

  return { activePage, setActivePage };
};

export const NavProvider = ({ children }: { children: React.ReactNode }) => {
  const [activePage, setActivePage] = useState("");
  return (
    <NavContext.Provider value={{ activePage, setActivePage }}>
      {children}
    </NavContext.Provider>
  );
};
