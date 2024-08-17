import { createContext, useContext, useState } from "react";

export type ContextData = {
    searchInput: string;
    setSearchInput: (value: string) => void;
};
export const SearchContext = createContext<ContextData>({
    searchInput: "",
    setSearchInput: (value: string) => {},
});

export const useSearch = () => {
    const { searchInput, setSearchInput } = useContext(SearchContext);

    return { searchInput, setSearchInput };
};

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
    const [searchInput, setSearchInput] = useState("");
    return <SearchContext.Provider value={{ searchInput, setSearchInput }}>{children}</SearchContext.Provider>;
};
