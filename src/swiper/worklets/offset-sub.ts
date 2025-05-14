import type { SharedValue } from 'react-native-reanimated';

/**
 * Moves `offset` one step *backwards* in a window of `size` positions,
 * updating `cardIndex` so the correct card remains centred.
 */
const offsetSub = (
  offset: { value: number } | SharedValue<number>,
  index: SharedValue<number>,
  cardIndex: { value: number } | SharedValue<number>,
  size: number = 3
) => {
  'worklet';

  if (offset.value === 0) {
    // From last to beginning
    offset.value = size - 1;

    // e.g. size 5 → half = 3
    cardIndex.value = index.value + (size - 1) / 2;

    return;
  }

  offset.value -= 1;
};

export default offsetSub;
