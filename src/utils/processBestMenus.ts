import { CalculateSPResult, IBestMenus } from "@/types/food";

export function processBestMenus(
    prevBests: IBestMenus | null,
    newResult: CalculateSPResult
): { bests: IBestMenus; updated: boolean } {
    const newBests: IBestMenus = prevBests ? { ...prevBests } : { scholar: null, worker: null, student: null };
    let updated = false;
    if (!prevBests) {
        return {
            bests: {
                scholar: { foods: newResult.foods, result: newResult, index: 0 },
                worker: { foods: newResult.foods, result: newResult, index: 0 },
                student: { foods: newResult.foods, result: newResult, index: 0 },
            },
            updated: true,
        };
    }
    if (!prevBests.scholar) {
        newBests.scholar = { foods: newResult.foods, result: newResult, index: 0 };
        updated = true;
    } else if (prevBests.scholar && newResult.sp > prevBests.scholar.result.sp) {
        newBests.scholar = {
            foods: {
                menu: newResult.foods.menu,
                stomach: newResult.foods.stomach,
            },
            result: newResult,
            index: prevBests.scholar.index,
        };
        updated = true;
    }

    const dollarPerCal = (result: CalculateSPResult) => result.totals.price / result.totals.cal;
    if (!prevBests.worker) {
        newBests.worker = { foods: newResult.foods, result: newResult, index: 0 };
        updated = true;
    } else if (prevBests.worker && dollarPerCal(newResult) < dollarPerCal(prevBests.worker.result)) {
        newBests.worker = {
            foods: {
                menu: newResult.foods.menu,
                stomach: newResult.foods.stomach,
            },
            result: newResult,
            index: prevBests.worker.index,
        };
        updated = true;
    }

    const dollerPerSp = (result: CalculateSPResult) => result.totals.price / result.sp;
    if (!prevBests.student) {
        newBests.student = { foods: newResult.foods, result: newResult, index: 0 };
        updated = true;
    } else if (prevBests.student && dollerPerSp(newResult) < dollerPerSp(prevBests.student.result)) {
        newBests.student = {
            foods: {
                menu: newResult.foods.menu,
                stomach: newResult.foods.stomach,
            },
            result: newResult,
            index: prevBests.student.index,
        };
        updated = true;
    }

    return {
        bests: newBests,
        updated: updated,
    };
}
