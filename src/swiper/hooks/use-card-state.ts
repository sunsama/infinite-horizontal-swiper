import { useMemo } from 'react';
import { makeMutable } from 'react-native-reanimated';

export default function useCardState({
  initialIndex,
  width,
  windowSize,
}: {
  width: number;
  windowSize: number;
  initialIndex: number;
}) {
  return useMemo(() => {
    const half = Math.floor(windowSize / 2);

    return {
      index: makeMutable<number>(initialIndex),
      offsets: Array.from({ length: windowSize }, (_, i) => makeMutable(i)),
      translateX: Array.from({ length: windowSize }, (_, i) =>
        makeMutable((i - half) * width)
      ),
      cardIndexes: Array.from({ length: windowSize }, (_, i) =>
        makeMutable(i + initialIndex - half)
      ),
    };
  }, [width, windowSize, initialIndex]);
}
