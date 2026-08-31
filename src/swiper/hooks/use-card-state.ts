import { useLayoutEffect, useMemo, useRef } from 'react';
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
  // `initialIndex` is initial by contract, so capture it on the first render.
  // Consumers pass a live value here, and re-reading it would rebuild the
  // mutables below at whatever unrelated moment the swiper happens to
  // re-render. Moving the swiper afterwards is what the imperative
  // `scrollToIndex` handle is for.
  const initialIndexRef = useRef(initialIndex);

  const cardState = useMemo(() => {
    const half = Math.floor(windowSize / 2);
    const startIndex = initialIndexRef.current;

    return {
      index: makeMutable<number>(startIndex),
      offsets: Array.from({ length: windowSize }, (_, i) => makeMutable(i)),
      translateX: Array.from({ length: windowSize }, () => makeMutable(0)),
      cardIndexes: Array.from({ length: windowSize }, (_, i) =>
        makeMutable(i + startIndex - half)
      ),
    };
  }, [windowSize]);

  // `width` is 0 until the first onLayout, so it must not be a dependency of
  // the memo above: recreating the mutables swaps every SharedValue the cards
  // hold, and because cards are keyed by slot they reconcile instead of
  // remounting — leaving each RenderItemProxy holding the index and focus it
  // lazily initialised from the discarded generation. Reposition in place
  // instead, using the same relation onTransferFinished maintains.
  useLayoutEffect(() => {
    const half = Math.floor(windowSize / 2);

    cardState.translateX.forEach((translateX, i) => {
      const offset = cardState.offsets[i];

      if (!offset) {
        return;
      }

      translateX.value = (offset.value - half) * width;
    });
  }, [cardState, width, windowSize]);

  return cardState;
}
