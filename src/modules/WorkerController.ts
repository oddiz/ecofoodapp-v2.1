/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type ICalcWorkerMessage,
  type CalculateParameters,
  type StartWorkerMessage,
  type CalculateSPResult,
} from "@/types/food";

class CustomEventEmitter {
  private listeners: Record<string, Array<(...args: any[]) => void>> = {};

  on(event: string, callback: (...args: any[]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event: string, ...args: any[]): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(...args));
    }
  }

  off(event: string, callback: (...args: any[]) => void): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      this.listeners[event] = eventListeners.filter((cb) => cb !== callback);
    }
  }
}

export class WorkerController extends CustomEventEmitter {
  private worker: Worker;
  bestMenus: CalculateSPResult | null = null;
  private calculateParameters: CalculateParameters | null = null;

  state: "idle" | "calculating" | "done" = "idle";

  constructor(worker: Worker) {
    super();
    this.worker = worker;
    this.worker.onmessage = this.processMessage.bind(this);
  }

  private processMessage(event: MessageEvent<ICalcWorkerMessage>): void {
    const { data } = event;

    switch (data?.op) {
      case "best_menus_update":
        this.bestMenus = data.result;
        this.emit("best_menus_update", this.bestMenus);
        break;
      case "calculation_end":
        this.state = "done";
        this.emit("calculation_end", this.bestMenus);
        break;
      default:
        console.error("Unknown message received from worker:", event);
    }
  }

  start(calcParams: CalculateParameters): void {
    if (this.state === "calculating") {
      console.warn("Calculation already in progress. Ignoring start request.");
      return;
    }

    this.state = "calculating";
    this.calculateParameters = calcParams;
    this.bestMenus = null;
    this.worker.postMessage({
      message: "start_worker",
      source: "calculator",
      ...calcParams,
    } as StartWorkerMessage);

    this.emit("calculation_start", calcParams);
  }

  stop(): void {
    if (this.state !== "calculating") {
      return;
    }

    this.worker.terminate();
    this.state = "idle";
    this.emit("calculation_stop");
  }

  getState(): "idle" | "calculating" | "done" {
    return this.state;
  }

  getBestMenu(): CalculateSPResult | null {
    return this.bestMenus;
  }

  getCalculateParameters(): CalculateParameters | null {
    return this.calculateParameters;
  }
}
