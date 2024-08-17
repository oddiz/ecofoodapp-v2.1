import {
  type ICalcWorkerMessage,
  type IBestMenus,
  type CalculateParameters,
  type StartWorkerMessage,
} from "@/types/food";

class CustomEventEmitter {
  private listeners: Record<string, Array<(...args: unknown[]) => void>> = {};

  on(event: string, callback: (...args: unknown[]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event: string, ...args: unknown[]): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach((callback: (...args: unknown[]) => void) =>
        callback(...args),
      );
    }
  }

  off(event: string, callback: (...args: unknown[]) => void): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      this.listeners[event] = eventListeners.filter((cb) => cb !== callback);
    }
  }
}

export class WorkerController extends CustomEventEmitter {
  worker: Worker;
  bestMenus: null | IBestMenus;
  calculateParameters: null | CalculateParameters;

  state: "idle" | "calculating" | "done";

  constructor(worker: Worker) {
    super();
    this.worker = worker;

    this.state = "idle";
    this.bestMenus = null;
    this.worker.onmessage = (message: MessageEvent<ICalcWorkerMessage>) =>
      this.processMessage(message);
    this.processMessage.bind(this);

    this.calculateParameters = null;
  }

  private processMessage(message: MessageEvent<ICalcWorkerMessage>) {
    if (message.data.op === "best_menus_update") {
      this.bestMenus = message.data.result;
      this.emit("best_menus_update");
    } else if (message.data.op === "calculation_end") {
      this.state = "done";
      this.emit("done");
    } else {
      console.error("Unknown message received from worker: ", message);
    }
  }

  postMessage(message: StartWorkerMessage) {
    this.worker.postMessage(message);
  }

  terminate() {
    this.state = "idle";
    this.worker.terminate();
  }

  start(calcParams: CalculateParameters) {
    this.state = "calculating";
    this.calculateParameters = calcParams;

    this.postMessage({
      message: "start_worker",
      ...calcParams
    } as StartWorkerMessage);
  }
}
