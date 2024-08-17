import { CalculateParameters, Food, IBestMenusMessage, ICalculateFilters, IFoods, ITastePref } from "@/types/food";
import getDefinitiveIterCount from "@/utils/getDefinitiveIterCount";
import { WorkerController } from "./WorkerController";

import EventEmitter from "eventemitter3";
import { getTaste } from "@/utils/getTaste";
const ITERATION_LIMIT = 10 ** 6;

export class Calculator extends EventEmitter {
    foods: IFoods;
    filters: ICalculateFilters | null;
    taste: ITastePref;
    maxMenuSize: number;
    workerControllers: WorkerController[];

    bestMenus: IBestMenusMessage["result"] | null;
    constructor(foods: IFoods, filters: ICalculateFilters | null, taste: ITastePref, maxMenuSize?: number) {
        super();
        this.foods = foods;
        this.filters = filters;
        this.taste = taste;
        this.maxMenuSize = maxMenuSize || 10;

        this.bestMenus = null;
        this.workerControllers = [];
    }

    determineCalculateTypes() {
        const result = new Array(this.maxMenuSize).fill(0).map((_, index) => {
            const menuSize: number = index + 1;
            const totalIterations = getDefinitiveIterCount(this.foods.selected.length, menuSize);
            console.log(this.foods.selected.length, menuSize, totalIterations);
            const calculateType: CalculateParameters["calculateType"] =
                totalIterations < ITERATION_LIMIT ? "definitive" : "random";
            return {
                menuSize,
                totalIterations,
                calculateType,
            };
        });
        return result;
    }

    spawnWorkers() {
        const calculateTypes = this.determineCalculateTypes();
        const workerControllers = calculateTypes.map(({ menuSize, calculateType }) => {
            const worker = new Worker(new URL("../calculator.worker.ts", import.meta.url), {
                type: "module",
            });
            console.log("spawning worker");
            const workerController = new WorkerController(worker);
            workerController.start({
                foods: this.foods,
                filters: this.filters,
                taste: getTaste(),
                menuSize: menuSize,
                calculateType: calculateType,
            });

            workerController.on("best_menus_update", () => {
                this.refreshResults();
            });
            workerController.on("done", () => {
                if (this.workerControllers.every((workerController) => workerController.state === "done")) {
                    console.log("all done");
                    for (const workerController of this.workerControllers) {
                        workerController.terminate();
                    }
                }
            });
            return workerController;
        });
        this.workerControllers = workerControllers;
        return workerControllers;
    }

    refreshResults() {
        for (const workerController of this.workerControllers) {
            if (!workerController.bestMenus) {
                continue;
            }
            if (!this.bestMenus) {
                this.bestMenus = workerController.bestMenus;
                this.emit("best_menus_update", this.bestMenus);
            } else {
                const newBestSp = workerController.bestMenus.scholar?.result.sp;
                const oldBestSp = this.bestMenus.scholar?.result.sp;

                if (newBestSp && oldBestSp && newBestSp > oldBestSp) {
                    this.bestMenus.scholar = workerController.bestMenus.scholar;
                    this.emit("best_menus_update", this.bestMenus);
                }
            }
        }
    }

    stop() {
        try {
            for (const workerController of this.workerControllers) {
                workerController.terminate();
            }

            this.workerControllers = [];
        } catch (error) {}
    }
    start() {
        this.stop();

        this.spawnWorkers();
    }
}
