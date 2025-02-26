import {
  IBestMenuTypes,
  type CalculateSPResult,
  type IBestMenus,
} from "@/types/food";

export function processBestMenus(
  prevBests: IBestMenus | null,
  newResult: CalculateSPResult,
): { bests: IBestMenus; updated: boolean } {
  const newBests: IBestMenus = prevBests
    ? { ...prevBests }
    : { scholar: null, worker: null, student: null };
  let updated = false;
  if (!prevBests) {
    return {
      bests: {
        scholar: {
          foods: newResult.foods,
          result: newResult,
          index: 0,
          type: IBestMenuTypes.SCHOLAR,
        },
        worker: {
          foods: newResult.foods,
          result: newResult,
          index: 0,
          type: IBestMenuTypes.WORKER,
        },
        student: {
          foods: newResult.foods,
          result: newResult,
          index: 0,
          type: IBestMenuTypes.STUDENT,
        },
      },
      updated: true,
    };
  }
  if (!prevBests.scholar) {
    newBests.scholar = {
      foods: newResult.foods,
      result: newResult,
      index: 0,
      type: IBestMenuTypes.SCHOLAR,
    };
    updated = true;
  } else if (prevBests.scholar && newResult.sp > prevBests.scholar.result.sp) {
    newBests.scholar = {
      foods: {
        menu: newResult.foods.menu,
      },
      result: newResult,
      index: prevBests.scholar.index,
      type: IBestMenuTypes.SCHOLAR,
    };
    updated = true;
  }

  const dollarPerCal = (result: CalculateSPResult) =>
    result.totals.price / result.totals.cal;
  if (!prevBests.worker) {
    newBests.worker = {
      foods: newResult.foods,
      result: newResult,
      index: 0,
      type: IBestMenuTypes.WORKER,
    };
    updated = true;
  } else if (
    prevBests.worker &&
    dollarPerCal(newResult) < dollarPerCal(prevBests.worker.result)
  ) {
    newBests.worker = {
      foods: {
        menu: newResult.foods.menu,
      },
      result: newResult,
      index: prevBests.worker.index,
      type: IBestMenuTypes.WORKER,
    };
    updated = true;
  }

  const dollerPerSp = (result: CalculateSPResult) =>
    result.totals.price / result.sp;
  if (!prevBests.student) {
    newBests.student = {
      foods: newResult.foods,
      result: newResult,
      index: 0,
      type: IBestMenuTypes.STUDENT,
    };
    updated = true;
  } else if (
    prevBests.student &&
    dollerPerSp(newResult) < dollerPerSp(prevBests.student.result)
  ) {
    newBests.student = {
      foods: {
        menu: newResult.foods.menu,
      },
      result: newResult,
      index: prevBests.student.index,
      type: IBestMenuTypes.STUDENT,
    };
    updated = true;
  }

  return {
    bests: newBests,
    updated: updated,
  };
}
