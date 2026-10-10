import { useCallback } from 'react';
import { type SharedValue, withSpring } from 'react-native-reanimated';
import onTransferFinished from '../worklets/on-transfer-finished';
import type { CardState } from '../swiper.types';

const useScrollToIndex = ({
  width,
  windowSize,
  visibleCount,
  finalX,
  cardState,
}: {
  width: number;
  cardState: CardState;
  finalX: SharedValue<number>;
  windowSize: number;
  visibleCount: number;
}) =>
  useCallback(
    (newIndex: number) => {
      const direction = newIndex > cardState.index.value ? -1 : 1;
      const half = Math.floor(windowSize / 2);

      cardState.index.value = newIndex;

      // Put the target cards in the slots that slide into view, so the
      // animation shows the right content.
      const firstIncomingOffset = half - direction;

      cardState.offsets.forEach((offset, i) => {
        const k = offset.value - firstIncomingOffset;

        if (k >= 0 && k < visibleCount) {
          cardState.cardIndexes[i]!.value = newIndex + k;
        }
      });

      finalX.value = withSpring(
        direction * width,
        {
          mass: 1,
          stiffness: 300,
          overshootClamping: false,
          restSpeedThreshold: 1,
          restDisplacementThreshold: 1,
          damping: 40,
          velocity: 50,
        },
        () => {
          cardState.cardIndexes.forEach((cardIndex, i) => {
            cardIndex.value =
              newIndex + cardState.offsets[i]!.value - firstIncomingOffset;
          });

          onTransferFinished({
            width,
            windowSize,
            finalX,
            cardState,
            direction,
          });
        }
      );
    },
    [width, cardState, finalX, windowSize, visibleCount]
  );

export default useScrollToIndex;
