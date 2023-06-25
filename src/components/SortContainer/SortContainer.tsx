import { memo, useEffect, useState } from 'react';
import classNames from 'classnames';

import { UseSort } from '../../algorithms';

import './SortContainer.scss';

const MAX_COLUMN_HEIGHT = 10;

export interface SortContainerProps {
  title: string;
  randomizedArrayOfNumbers: number[];
  useSort: UseSort;
}

export const SortContainer: React.FC<SortContainerProps> = memo(
  ({ title, randomizedArrayOfNumbers, useSort }) => {
    const [isSorting, setIsSorting] = useState<boolean>(false);
    const [tickLength, setTickLength] = useState<number>(20);

    const {
      sortedArray,
      iterableSort,
      reset,
      tickCount,
      isSorted,
      red,
      green,
      blue,
    } = useSort({
      arrayToSort: randomizedArrayOfNumbers,
    });

    // const sortGeneratorRef = useRef(makeIterable());

    useEffect(() => {
      if (isSorted) {
        setIsSorting(false);
      }
    }, [isSorted]);

    useEffect(() => {
      let interval = 0;

      if (isSorting) {
        interval = setInterval(() => {
          iterableSort.current.next();
        }, tickLength);
      } else if (interval) {
        clearInterval(interval);
      }

      return () => clearInterval(interval);
    }, [isSorting, tickLength, iterableSort]);

    return (
      <div className="sort-container">
        <h2>
          {title} - Swaps: {tickCount}
        </h2>
        <div className="column-table">
          {sortedArray.map((number, index) => (
            <div
              key={number}
              className={classNames('column', {
                blue: blue?.includes(index),
                red: red?.includes(index),
                green: green?.includes(index),
              })}
              style={{
                height: `${
                  (MAX_COLUMN_HEIGHT / sortedArray.length) * number
                }rem`,
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
              iterableSort.current.next();
            }}
          >
            Step
          </button>
          <button
            disabled={isSorting}
            onClick={() => {
              reset();
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
