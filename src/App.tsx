import './App.scss';
import { useBubbleSort, useQuickSort } from './algorithms';
import { SortContainer } from './components';
import { RandomWithSeed } from './utils/Random';

const seed = 420;
const numberOfElements = 50;

RandomWithSeed.init(seed);

const sortedArrayOfNumbers = Array.from(Array(numberOfElements).keys());
const randomizedArrayOfNumbers = [...sortedArrayOfNumbers].sort(
  () => RandomWithSeed.generate() - 0.5,
);

export const App = () => {
  return (
    <main>
      <h1>Sorting visualized</h1>
      <SortContainer
        title="Bubble Sort"
        randomizedArrayOfNumbers={[...randomizedArrayOfNumbers]}
        useSort={useBubbleSort}
      />
      <SortContainer
        title="Quick Sort"
        randomizedArrayOfNumbers={[...randomizedArrayOfNumbers]}
        useSort={useQuickSort}
      />
    </main>
  );
};
