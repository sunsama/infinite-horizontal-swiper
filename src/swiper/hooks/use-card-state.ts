import { useMemo } from 'react';
import { makeMutable, type SharedValue } from 'react-native-reanimated';

export type CardState = {
  index: SharedValue<number>;
  offsets: SharedValue<number>[];
  translateX: SharedValue<number>[];
  cardIndexes: SharedValue<number>[];
};

const useCardState = (width: number, windowSize: number) =>
  useMemo(() => {
    const half = Math.floor(windowSize / 2);

    return {
      index: makeMutable<number>(0),
      offsets: Array.from({ length: windowSize }, (_, i) => makeMutable(i)),
      translateX: Array.from({ length: windowSize }, (_, i) =>
        makeMutable((i - half) * width)
      ),
      cardIndexes: Array.from({ length: windowSize }, (_, i) =>
        makeMutable(i - half)
      ),
    };
  }, [width, windowSize]);

export default useCardState;
