import { useSearch } from "@/hooks/useSearch";
import React, { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";

export const Search = ({ className }: { className: string }) => {
    const { searchInput, setSearchInput } = useSearch();
    const searchRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const onKeyDownHandler = (e: KeyboardEvent) => {
            //if ctrl+f is pressed
            if (e.ctrlKey && e.key === "f" && searchRef?.current) {
                e.preventDefault();
                searchRef.current.focus();
            }
        };
        document.addEventListener("keydown", onKeyDownHandler);
        return () => {
            document.removeEventListener("keydown", onKeyDownHandler);
        };
    }, []);

    return (
        <div className={className}>
            <div className="relative h-full min-w-[24rem] max-w-2xl">
                <input
                    ref={searchRef}
                    className="h-full w-full rounded-md bg-primary-300 bg-transparent px-3 text-lg text-primarydark-400 outline-none dark:bg-primarydark-500 dark:text-primary-300 focus:dark:bg-primarydark-400"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <div className="absolute right-2 top-0 flex h-full flex-row items-center justify-center">
                    {searchInput ? (
                        <IoClose
                            className="cursor-pointer text-primary-500 dark:text-primary-300"
                            size={32}
                            onClick={() => setSearchInput("")}
                        />
                    ) : (
                        <div className="flex flex-row items-center justify-center dark:text-primary-500 ">
                            <kbd className={kbdStyle}>Ctrl</kbd> + <kbd className={kbdStyle}>F</kbd>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const kbdStyle =
    /*tw*/ "py-[2px] px-[4px] m-0 tracking-tighter rounded-sm border-1 border-primarydark-500 border-b-1  border-b-primarydark-200 dark:bg-primarydark-650 text-md text-center min-w-[16px] opacity-90";
