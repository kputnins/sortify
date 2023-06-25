import { useRef, useState, useCallback, useEffect } from 'react';

import { UseSort } from './types';

export const useQuickSort: UseSort = ({ arrayToSort, setSortedArray }) => {
  const outer = useRef<number>();
  const inner = useRef<number>();

  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [tickCount, setTickCount] = useState<number>(0); // set in state to force a re-render on change
  const [red, setRed] = useState<number[]>([]);
  const [green, setGreen] = useState<number[]>([]);
  const [blue, setBlue] = useState<number[]>([]);

  const reset = useCallback(() => {
    outer.current = 0;
    inner.current = 0;
    setTickCount(0);

    setIsSorted(false);
    setRed([]);
    setBlue([]);
    setGreen([]);
  }, []);

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    if (arrayToSort.every((number, index) => number === index)) {
      setIsSorted(true);
      setGreen(arrayToSort);
    } else {
      setIsSorted(false);
    }
  }, [arrayToSort]);

  const swap = useCallback(
    async (arr: number[], a: number, b: number) => {
      const tmp = arr[a];
      arr[a] = arr[b];
      arr[b] = tmp;

      await new Promise((resolve) => setTimeout(resolve, 10));
      setSortedArray([...arr]);
      setTickCount((previousValue) => previousValue + 1);
    },
    [setSortedArray],
  );

  const partition = useCallback(
    async (arr: number[], low: number, high: number) => {
      const pivot = arr[high];
      setRed([high]);
      let i = low;
      for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
          setBlue([i, j]);
          await swap(arr, i, j);
          i++;
        }
      }

      setBlue([i, high]);
      await swap(arr, i, high);

      return i;
    },
    [swap],
  );

  const quicksort = useCallback(
    async (arr: number[], low: number, high: number) => {
      if (low < high) {
        const p = await partition(arr, low, high);

        await quicksort(arr, low, p - 1);
        await quicksort(arr, p + 1, high);
      }
    },
    [partition],
  );

  const sort = useCallback(async () => {
    const { current: i } = outer;
    const { current: j } = inner;

    if (i !== undefined && j !== undefined) {
      const newArray = [...arrayToSort];

      await quicksort(newArray, 0, newArray.length - 1);
    }
  }, [arrayToSort, quicksort]);

  const tick = useCallback(async () => {
    await sort();
    setTickCount((previousValue) => previousValue + 1);
  }, [sort]);

  return {
    sort,
    tick,
    reset,
    tickCount,
    isSorted,
    red,
    green,
    blue,
  };
};
