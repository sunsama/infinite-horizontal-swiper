import { type SharedValue, useAnimatedStyle } from 'react-native-reanimated';

// Height comes from flex, not from onLayout, so the swiper refits in the same
// layout pass when its parent changes size.
const useSwiperTransformStyle = (width: number, finalX: SharedValue<number>) =>
  useAnimatedStyle(
    () => ({
      width,
      flex: 1,
      transform: [{ translateX: finalX.value }],
    }),
    [width]
  );

export default useSwiperTransformStyle;
