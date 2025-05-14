import { type SharedValue, useAnimatedStyle } from 'react-native-reanimated';

const useSwiperTransformStyle = (
  width: number,
  height: number,
  finalX: SharedValue<number>
) =>
  useAnimatedStyle(
    () => ({
      width,
      height,
      transform: [{ translateX: finalX.value }],
    }),
    [width, height]
  );

export default useSwiperTransformStyle;
