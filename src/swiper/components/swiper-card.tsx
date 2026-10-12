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
    activeIndexNumber: activeIndex.value,
  }));

  const updateIndexes = useCallback(
    (indexNumber: number, activeIndexNumber: number) => {
      setState((prev) =>
        prev.indexNumber === indexNumber &&
        prev.activeIndexNumber === activeIndexNumber
          ? prev
          : { indexNumber, activeIndexNumber }
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
      runOnJS(updateIndexes)(newIndex, newActiveIndex);
    }
  );

  const offset = state.indexNumber - state.activeIndexNumber;

  return renderItem(
    state.indexNumber,
    offset === 0,
    offset >= 0 && offset < visibleCount
  );
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
