import offsetAdd from '../worklets/offset-add';
import offsetSub from '../worklets/offset-sub';
import type { CardState } from '../hooks/use-card-state';
import type { SharedValue } from 'react-native-reanimated';

function onTransferFinished({
  cardState,
  direction,
  width,
  windowSize,
  finalX,
}: {
  cardState: CardState;
  direction: number;
  windowSize: number;
  width: number;
  finalX: SharedValue<number>;
}) {
  'worklet';

  for (let i = 0; i < windowSize; i++) {
    if (
      !cardState.offsets[i] ||
      !cardState.cardIndexes[i] ||
      !cardState.translateX[i]
    ) {
      continue;
    }

    if (direction === 1) {
      offsetAdd(
        cardState.offsets[i]!,
        cardState.index,
        cardState.cardIndexes[i]!,
        windowSize
      );
    } else {
      offsetSub(
        cardState.offsets[i]!,
        cardState.index,
        cardState.cardIndexes[i]!,
        windowSize
      );
    }

    const half = Math.floor(windowSize / 2);

    cardState.translateX[i]!.value =
      -half * width + cardState.offsets[i]!.value * width;
  }

  finalX.value = 0;
}

export default onTransferFinished;
