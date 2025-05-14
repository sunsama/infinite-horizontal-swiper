import type { SharedValue } from 'react-native-reanimated';

/**
 * Moves `offset` one step *forwards* in a window of `size` positions,
 * updating `cardIndex` so the correct card remains centred.
 */
const offsetAdd = (
  offset: { value: number } | SharedValue<number>,
  index: SharedValue<number>,
  cardIndex: { value: number } | SharedValue<number>,
  size: number = 3
) => {
  'worklet';

  if (offset.value === size - 1) {
    // From last to beginning
    offset.value = 0;
    cardIndex.value = index.value - (size - 1) / 2;

    return;
  }

  offset.value += 1;
};

export default offsetAdd;
