import { useCallback, useState } from 'react';
import Animated, {
  runOnJS,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
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

  const original = useSharedValue<null | number>(null);

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
      if (original.value === null) {
        original.value = newIndex;
      }

      // console.info(
      //   "[RenderItemProxy] newIndex",
      //   newIndex,
      //   "activeIndex",
      //   newActiveIndex,
      //   "originalIndex",
      //   original.value,
      //   "focus",
      //   newIndex === newActiveIndex,
      // );
      runOnJS(updateIndexes)(newIndex, newActiveIndex);
    }
  );

  return renderItem(indexNumber, isFocused);
};

type CardProps = {
  renderItem: RenderItem;
  index: SharedValue<number>;
  activeIndex: SharedValue<number>;
  translateX: SharedValue<number>;
};

const SwiperCard = ({
  renderItem,
  activeIndex,
  index,
  translateX,
}: CardProps) => {
  //#region Boilerplate
  //#endregion

  //#region Styles
  const transformStyle = useAnimatedStyle(
    () => ({
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      transform: [{ translateX: translateX.value }],
    }),
    [translateX]
  );

  //#endregion

  return (
    <Animated.View style={transformStyle}>
      <RenderItemProxy
        renderItem={renderItem}
        activeIndex={activeIndex}
        index={index}
      />
    </Animated.View>
  );
};

export default SwiperCard;
