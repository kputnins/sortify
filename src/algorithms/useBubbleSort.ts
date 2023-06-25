import { useRef, useState, useCallback, useEffect } from 'react';

import { UseSort } from './types';

export const useBubbleSort: UseSort = ({ arrayToSort, setSortedArray }) => {
  const outer = useRef<number>();
  const inner = useRef<number>();

  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [tickCount, setTickCount] = useState<number>(0); // set in state to force a re-render on change

  const reset = useCallback(() => {
    outer.current = 0;
    inner.current = 0;
    setTickCount(0);

    setIsSorted(false);
  }, []);

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    if (arrayToSort.every((number, index) => number === index)) {
      setIsSorted(true);
    } else {
      setIsSorted(false);
    }
  }, [arrayToSort]);

  const sort = useCallback(() => {
    const { current: i } = outer;
    const { current: j } = inner;

    if (i !== undefined && j !== undefined) {
      const newArray = [...arrayToSort];

      if (i < newArray.length) {
        const elementToMove = newArray[j];

        if (elementToMove > newArray[j + 1]) {
          newArray[j] = newArray[j + 1];
          newArray[j + 1] = elementToMove;

          setSortedArray(newArray);
        }

        inner.current = j + 1;

        if (j === newArray.length - 1 - i) {
          outer.current = i + 1;
          inner.current = 0;
        }
      }
    }
  }, [arrayToSort, setSortedArray]);

  const tick = useCallback(() => {
    sort();
    setTickCount((previousValue) => previousValue + 1);
  }, [sort]);

  return {
    sort,
    tick,
    reset,
    tickCount,
    blue: [inner.current || 0],
    green:
      (outer.current &&
        Array.from(Array(arrayToSort.length).keys()).slice(-outer.current)) ||
      [],
    isSorted,
  };
};
