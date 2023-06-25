export interface UseSortParams {
  arrayToSort: number[];
}

export type UseSort = (params: UseSortParams) => {
  sortedArray: number[];
  sort: () => Generator<undefined, void, unknown>;
  iterableSort: React.MutableRefObject<Generator<undefined, void, unknown>>;
  reset: () => void;
  tickCount: number;
  isSorted: boolean;
  red?: number[];
  green?: number[];
  blue?: number[];
};
