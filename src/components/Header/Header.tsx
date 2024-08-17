import { Search } from "./Search";

export const Header = () => {
    return (
        <header className="flex h-24 w-full flex-shrink-0 flex-row border-b-[1px] py-5 px-5 dark:border-b-primarydark-500 dark:bg-primarydark-650">
            <Search className="h-full flex-grow" />
        </header>
    );
};
