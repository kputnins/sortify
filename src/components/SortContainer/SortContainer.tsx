import {
  Dispatch,
  SetStateAction,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';

import './SortContainer.scss';
import classNames from 'classnames';

export interface SortContainerProps {
  title: string;
  sortedArrayOfNumbers: number[];
  randomizedArrayOfNumbers: number[];
  maxColumnHeight: number;
}

interface NewSortParams {
  arrayToSort: number[];
  setSortedArray: Dispatch<SetStateAction<number[]>>;
  timeout?: number;
}

let i = 0;
let j = 0;

const bubbleSort = ({ arrayToSort, setSortedArray }: NewSortParams) => {
  const newArray = [...arrayToSort];

  if (i < newArray.length) {
    const elementToMove = newArray[j];

    if (elementToMove > newArray[j + 1]) {
      newArray[j] = newArray[j + 1];
      newArray[j + 1] = elementToMove;

      setSortedArray(newArray);
    }

    j++;

    if (j === newArray.length - 1 - i) {
      i++;
      j = 0;
    }
  }
};

export const SortContainer: React.FC<SortContainerProps> = memo(
  ({
    title,
    sortedArrayOfNumbers,
    randomizedArrayOfNumbers,
    maxColumnHeight,
  }) => {
    const [sortedArray, setSortedArray] = useState<number[]>(
      randomizedArrayOfNumbers,
    );
    const [isSorting, setIsSorting] = useState<boolean>(false);
    const [tickLength, setTickLength] = useState<number>(50);
    const [tickCount, setTickCount] = useState<number>(0);
    const [isSorted, setIsSorted] = useState<boolean>(false);

    useEffect(() => {
      if (
        !sortedArray.some(
          (number, index) => number !== sortedArrayOfNumbers[index],
        )
      ) {
        setIsSorted(true);
        setIsSorting(false);
      } else {
        setIsSorted(false);
      }
    }, [sortedArray, sortedArrayOfNumbers]);

    const tick = useCallback(() => {
      bubbleSort({
        arrayToSort: sortedArray,
        setSortedArray,
        timeout: tickLength,
      });
      setTickCount((previousValue) => previousValue + 1);
    }, [sortedArray, setSortedArray, tickLength]);

    useEffect(() => {
      let interval = 0;

      if (isSorting) {
        interval = setInterval(() => {
          tick();
        }, tickLength);
      } else {
        clearInterval(interval);
      }

      return () => clearInterval(interval);
    }, [isSorting, tickLength, tick]);

    return (
      <div className="sort-container">
        <h2>
          {title} - Passes: {i}; Steps: {tickCount}
        </h2>
        <div className="column-table">
          {sortedArray.map((number, index) => (
            <div
              key={number}
              className={classNames('column', {
                current: index === j,
                sorted: index >= sortedArrayOfNumbers.length - i,
              })}
              style={{
                height: `${(maxColumnHeight / sortedArray.length) * number}rem`,
              }}
            />
          ))}
        </div>
        <div className="controls-container">
          <button
            disabled={isSorting || isSorted}
            onClick={() => setIsSorting(true)}
          >
            Start
          </button>
          <button
            disabled={!isSorting || isSorted}
            onClick={() => setIsSorting(false)}
          >
            Stop
          </button>
          <button
            disabled={isSorting || isSorted}
            onClick={async () => {
              await new Promise((resolve) => setTimeout(resolve, tickLength));
              tick();
            }}
          >
            Step
          </button>
          <button
            onClick={() => {
              i = 0;
              j = 0;
              setSortedArray(randomizedArrayOfNumbers);
              setTickCount(0);
            }}
          >
            Reset
          </button>
          <div>
            <input
              type="range"
              id="volume"
              name="volume"
              min="0"
              max="500"
              step="2"
              value={tickLength}
              onChange={(event) => setTickLength(Number(event.target.value))}
            />
            <label htmlFor="volume">{tickLength} Step timeout (ms)</label>
          </div>
        </div>
      </div>
    );
  },
);
