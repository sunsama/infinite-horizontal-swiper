import offsetAdd from '../worklets/offset-add';
import offsetSub from '../worklets/offset-sub';
import type { CardState } from '../hooks/use-card-state';

function determineTransition(
  cardState: CardState,
  windowSize: number,
  direction: number
) {
  'worklet';

  const cardIndexesCopy = cardState.cardIndexes.map((cardIndex) => ({
    value: cardIndex.value,
  }));

  const offsetsCopy = cardState.offsets.map((offset) => ({
    value: offset.value,
  }));

  if (direction === 1) {
    offsetsCopy.forEach((offset, index) =>
      offsetAdd(offset, cardState.index, cardIndexesCopy[index]!, windowSize)
    );
  } else {
    offsetsCopy.forEach((offset, index) =>
      offsetSub(offset, cardState.index, cardIndexesCopy[index]!, windowSize)
    );
  }
}

export default determineTransition;
