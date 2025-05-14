import { useCallback } from 'react';
import determineTransition from '../worklets/determine-transition';
import { type SharedValue, withSpring } from 'react-native-reanimated';
import onTransferFinished from '../worklets/on-transfer-finished';
import type { CardState } from '../hooks/use-card-state';

const useScrollToIndex = ({
  width,
  windowSize,
  finalX,
  cardState,
}: {
  width: number;
  cardState: CardState;
  finalX: SharedValue<number>;
  windowSize: number;
}) =>
  useCallback(
    (newIndex: number) => {
      const direction = newIndex > cardState.index.value ? -1 : 1;

      cardState.index.value = newIndex;
      const half = Math.ceil(windowSize / 2);
      const parsedIndex = direction === -1 ? newIndex - half : newIndex;

      const cardOffsetIndex = cardState.offsets.findIndex(
        (offset) => offset.value === half - (direction === -1 ? 0 : 2)
      );

      // Only change the relevant index for the card we're going to show, we'll
      // update the rest of the cards in the animation callback.
      // We do this so that the animation looks correct.
      cardState.cardIndexes[cardOffsetIndex]!.value =
        direction === 1 ? parsedIndex : newIndex;

      determineTransition(cardState, windowSize, direction);

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
          // Now change all indexes to the correct value
          cardState.cardIndexes.forEach((cardIndex, i) => {
            const offset = cardState.offsets[i]!.value;

            cardIndex.value =
              direction === -1
                ? parsedIndex + offset
                : newIndex - (cardOffsetIndex - i);
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
    [width, cardState, finalX, windowSize]
  );

export default useScrollToIndex;
