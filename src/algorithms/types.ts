import { Dispatch, SetStateAction } from 'react';

export interface UseSortParams {
  arrayToSort: number[];
  setSortedArray: Dispatch<SetStateAction<number[]>>;
}

export type UseSort = (params: UseSortParams) => {
  sort: () => void;
  tick: () => void;
  reset: () => void;
  tickCount: number;
  currentInner: number;
  currentOuter: number;
  isSorted: boolean;
};
