import { createContext, useContext, useState } from "react";

export type ContextData = {
    activePage: string;
    setActivePage: (value: string) => void;
};
export const NavContext = createContext<ContextData>({
    activePage: "",
    setActivePage: (value: string) => {return value},

});

export const useNavigator = () => {
    const { activePage, setActivePage } = useContext(NavContext);

    return { activePage, setActivePage };
};

export const NavProvider = ({ children }: { children: React.ReactNode }) => {
    const [activePage, setActivePage] = useState("");
    return <NavContext.Provider value={{ activePage, setActivePage }}>{children}</NavContext.Provider>;
};
