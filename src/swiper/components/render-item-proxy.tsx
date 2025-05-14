import { useCallback, useState } from 'react';
import {
  runOnJS,
  type SharedValue,
  useAnimatedReaction,
} from 'react-native-reanimated';
import type { RenderItem } from '../swiper.types';

const RenderItemProxy = ({
  renderItem,
  index,
  activeIndex,
}: {
  renderItem: RenderItem;
  index: SharedValue<number>;
  activeIndex: SharedValue<number>;
}) => {
  const [indexNumber, setIndexNumber] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const updateIndexes = useCallback(
    (newIndex: number, newActiveIndex: number) => {
      setIsFocused(newIndex === newActiveIndex);
      setIndexNumber(newIndex);
    },
    []
  );

  useAnimatedReaction(
    () => ({
      index: index.value,
      activeIndex: activeIndex.value,
    }),
    ({ index: newIndex, activeIndex: newActiveIndex }) => {
      runOnJS(updateIndexes)(newIndex, newActiveIndex);
    }
  );

  return renderItem(indexNumber, isFocused);
};

export default RenderItemProxy;
