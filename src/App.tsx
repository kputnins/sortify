import './App.scss';
import { SortContainer } from './components';
import { RandomWithSeed } from './utils/Random';

const seed = 420;
const numberOfElements = 50;
const maxColumnHeight = 10;

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
        sortedArrayOfNumbers={sortedArrayOfNumbers}
        randomizedArrayOfNumbers={randomizedArrayOfNumbers}
        maxColumnHeight={maxColumnHeight}
      />
    </main>
  );
};
