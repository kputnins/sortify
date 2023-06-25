import { useRef, useState, useCallback, useEffect } from 'react';

import { UseSort } from './types';

export const useQuickSort: UseSort = ({ arrayToSort }) => {
  const [sortedArray, setSortedArray] = useState<number[]>(arrayToSort);
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [tickCount, setTickCount] = useState<number>(0); // set in state to force a re-render on change
  const [red, setRed] = useState<number[]>([]);
  const [green, setGreen] = useState<number[]>([]);
  const [blue, setBlue] = useState<number[]>([]);

  const arrayHash = sortedArray.join();

  useEffect(() => {
    if (sortedArray.every((number, index) => number === index)) {
      setIsSorted(true);
      setGreen(sortedArray);
    } else {
      setIsSorted(false);
    }
  }, [sortedArray, arrayHash]);

  const swap = useCallback(
    function* (arr: number[], a: number, b: number) {
      const tmp = arr[a];
      arr[a] = arr[b];
      arr[b] = tmp;

      setSortedArray([...arr]);
      setTickCount((previousValue) => previousValue + 1);

      yield;
    },
    [setSortedArray],
  );

  const partition = useCallback(
    function* (
      arr: number[],
      low: number,
      high: number,
    ): Generator<undefined, number, unknown> {
      const pivot = arr[high];
      setRed([high]);
      let i = low;
      for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
          setBlue([i, j]);
          yield* swap(arr, i, j);
          i++;
        }
      }

      setBlue([i, high]);
      yield* swap(arr, i, high);

      return i;
    },
    [swap],
  );

  const quicksort = useCallback(
    function* (
      arr: number[],
      low: number,
      high: number,
    ): Generator<undefined, void, unknown> {
      if (low < high) {
        const p = yield* partition(arr, low, high);

        yield* quicksort(arr, low, p - 1);
        yield* quicksort(arr, p + 1, high);
      }
    },
    [partition],
  );

  const sort = useCallback(
    function* (): Generator<undefined, void, unknown> {
      const newArray = [...sortedArray];
      yield* quicksort(newArray, 0, newArray.length - 1);
    },
    [quicksort, sortedArray],
  );

  const reset = useCallback(() => {
    setSortedArray(arrayToSort);
    setIsSorted(false);
    setTickCount(0);

    setRed([]);
    setBlue([]);
    setGreen([]);

    iterableSort.current = sort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrayToSort]);

  const iterableSort = useRef(sort());

  return {
    sortedArray,
    sort,
    iterableSort,
    reset,
    tickCount,
    isSorted,
    red,
    green,
    blue,
  };
};
