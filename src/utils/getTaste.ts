import { ITastePref } from "@/types/food";

export function getTaste() {
    const taste = JSON.parse(localStorage.getItem("taste") || "{}") as unknown as ITastePref;

    return new Map(Object.entries(taste));
}
