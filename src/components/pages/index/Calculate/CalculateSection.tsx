import React, { useState, useRef, useEffect } from 'react';
import { type CalculateParameters, type IBestMenus } from "@/types/food";
import { useStore } from '@/store/useStore'; // Adjust the import path as needed
import { WorkerController } from "@/modules/WorkerController";

export function CalculateSection() {
    const [results, setResults] = useState<IBestMenus[]>([]);
    const [isCalculating, setIsCalculating] = useState(false);
    const workerControllerRef = useRef<WorkerController | null>(null);

    // Use the Zustand store
    const { selectedFoods, activeFilters } = useStore();

    useEffect(() => {
        // Initialize the WorkerController
        const worker = new Worker(new URL('@/workers/spWorker.ts', import.meta.url));
        workerControllerRef.current = new WorkerController(worker);

        // Clean up the worker when the component unmounts
        return () => {
            if (workerControllerRef.current) {
                workerControllerRef.current.terminate();
            }
        };
    }, []);

    function startCalculation() {
       if (!workerControllerRef.current || selectedFoods.length === 0) {
  console.error('WorkerController not initialized or no foods selected');
  return;
}

        setIsCalculating(true);
        setResults([]);

        const calcParams: CalculateParameters = {
            selectedFoods,
            stomachFoods: [], // Add stomach foods if needed
            filters: activeFilters,
            taste: new Map(), // Add taste preferences if needed
            menuSize: 5, // Set an appropriate menu size
            calculateType: 'default', // Set the appropriate calculate type
        };

        workerControllerRef.current.on('best_menus_update', () => {
            if (workerControllerRef.current?.bestMenus) {
                setResults(prevResults => [...prevResults, workerControllerRef.current!.bestMenus!]);
            }
        });

        workerControllerRef.current.on('done', () => {
            setIsCalculating(false);
        });

        workerControllerRef.current.start(calcParams);
    }

    return (
        <div
            id="selected-foods"
            className="m-0 flex h-full w-full flex-col items-center overflow-hidden"
        >
            <button
                onClick={startCalculation}
                className={`pointer-cursor h-10 w-10 ${
                    isCalculating ? 'bg-gray-500' : 'bg-ecogreen-500'
                }`}
                disabled={isCalculating || selectedFoods.length === 0}
            >
                {isCalculating ? 'Calculating...' : 'Calculate'}
            </button>
            {results.map((result, i) => (
                <div key={i}>{result.scholar?.result.sp}</div>
            ))}
        </div>
    );
}
