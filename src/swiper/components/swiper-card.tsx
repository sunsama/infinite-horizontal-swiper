import { useCallback, useState } from 'react';
import Animated, {
  runOnJS,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated';
import type { RenderItem } from '../swiper.types';

const RenderItemProxy = ({
  renderItem,
  index,
  activeIndex,
  visibleCount,
}: {
  renderItem: RenderItem;
  index: SharedValue<number>;
  activeIndex: SharedValue<number>;
  visibleCount: number;
}) => {
  const [state, setState] = useState(() => ({
    indexNumber: index.value,
    isFocused: index.value === activeIndex.value,
    isVisible:
      index.value >= activeIndex.value &&
      index.value < activeIndex.value + visibleCount,
  }));

  const updateIndexes = useCallback(
    (indexNumber: number, isFocused: boolean, isVisible: boolean) => {
      setState((prev) =>
        prev.indexNumber === indexNumber &&
        prev.isFocused === isFocused &&
        prev.isVisible === isVisible
          ? prev
          : { indexNumber, isFocused, isVisible }
      );
    },
    []
  );

  useAnimatedReaction(
    () => ({
      index: index.value,
      activeIndex: activeIndex.value,
    }),
    ({ index: newIndex, activeIndex: newActiveIndex }) => {
      runOnJS(updateIndexes)(
        newIndex,
        newIndex === newActiveIndex,
        newIndex >= newActiveIndex && newIndex < newActiveIndex + visibleCount
      );
    },
    [visibleCount]
  );

  return renderItem(state.indexNumber, state.isFocused, state.isVisible);
};

type CardProps = {
  renderItem: RenderItem;
  index: SharedValue<number>;
  activeIndex: SharedValue<number>;
  translateX: SharedValue<number>;
  cardWidth: number;
  visibleCount: number;
};

const SwiperCard = ({
  renderItem,
  activeIndex,
  index,
  translateX,
  cardWidth,
  visibleCount,
}: CardProps) => {
  const transformStyle = useAnimatedStyle(
    () => ({
      position: 'absolute',
      left: 0,
      width: cardWidth,
      top: 0,
      bottom: 0,
      transform: [{ translateX: translateX.value }],
    }),
    [translateX, cardWidth]
  );

  return (
    <Animated.View style={transformStyle}>
      <RenderItemProxy
        renderItem={renderItem}
        activeIndex={activeIndex}
        index={index}
        visibleCount={visibleCount}
      />
    </Animated.View>
  );
};

export default SwiperCard;
