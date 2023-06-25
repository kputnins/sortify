import { useState, useCallback, useEffect, useRef } from 'react';

import { UseSort } from './types';

export const useBubbleSort: UseSort = ({ arrayToSort }) => {
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

  const sort = useCallback(
    function* (): Generator<undefined, void, unknown> {
      const newArray = [...sortedArray];
      for (let i = 0; i < newArray.length; i++) {
        for (let j = 0; j < newArray.length - i - 1; j++) {
          if (newArray[j] > newArray[j + 1]) {
            setBlue([j + 2]);
            setRed([j + 1]);

            const temp = newArray[j];
            newArray[j] = newArray[j + 1];
            newArray[j + 1] = temp;

            setSortedArray(newArray);
            setTickCount((previousValue) => previousValue + 1);

            yield;
          }
        }

        setGreen((previousValue) => [
          ...previousValue,
          newArray.length - i - 1,
        ]);
      }
    },
    [sortedArray, setSortedArray],
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
    red,
    tickCount,
    blue,
    green,
    isSorted,
  };
};
