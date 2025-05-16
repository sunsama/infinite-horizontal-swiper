import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import type { SwiperMethods, SwiperProps } from '../swiper.types';
import { ACTIVATION_DISTANCE_IN_PX } from '../lib/constants';
import { type LayoutChangeEvent, StyleSheet, View } from 'react-native';
import useCardState from '../hooks/use-card-state';
import determineTransition from '../worklets/determine-transition';
import onTransferFinished from '../worklets/on-transfer-finished';
import useCards from '../hooks/use-cards';
import useSwiperTransformStyle from '../hooks/use-swiper-transform-style';
import useScrollToIndex from '../hooks/use-scroll-to-index';

export const InfiniteHorizontalSwiper = forwardRef<SwiperMethods, SwiperProps>(
  ({ renderItem, windowSize = 3 }, swiperRef) => {
    if (windowSize < 3 || windowSize % 2 === 0) {
      throw new Error('size must be an odd number greater than 1');
    }

    const [{ width, height }, setDimensions] = useState({
      width: 0,
      height: 0,
    });

    const onLayout = useCallback((event: LayoutChangeEvent) => {
      setDimensions(event.nativeEvent.layout);
    }, []);

    const cardState = useCardState(width, windowSize);
    const cards = useCards(windowSize, renderItem, cardState);
    const finalX = useSharedValue(0);
    const contextStartX = useSharedValue(-1);
    const contextEndX = useSharedValue(-1);

    const tapGesture = Gesture.Pan()
      .activeOffsetX([-15, 15])
      .onStart(() => {
        contextStartX.value = finalX.value;
      })
      .onUpdate((event) => {
        finalX.value = contextStartX.value + event.translationX;
        contextEndX.value = contextStartX.value + event.translationX;
      })
      .onEnd((gestureState) => {
        const direction = contextEndX.value - contextStartX.value < 0 ? -1 : 1;
        const shouldActivate =
          Math.abs(contextEndX.value - contextStartX.value) >
          ACTIVATION_DISTANCE_IN_PX;

        if (!shouldActivate) {
          finalX.value = withSpring(0, {
            mass: 1,
            stiffness: 300,
            overshootClamping: false,
            restSpeedThreshold: 1,
            restDisplacementThreshold: 1,
            damping: 40,
          });

          return;
        }

        cardState.index.value += -direction;

        determineTransition(cardState, windowSize, direction);

        finalX.value = withSpring(
          direction * width,
          {
            mass: 1,
            stiffness: 300,
            overshootClamping: false,
            restSpeedThreshold: 1,
            restDisplacementThreshold: 1,
            damping: 40,
            velocity: gestureState.velocityX,
          },
          () => {
            onTransferFinished({
              width,
              finalX,
              windowSize,
              cardState,
              direction,
            });
          }
        );
      });

    const scrollToIndex = useScrollToIndex({
      width,
      finalX,
      windowSize,
      cardState,
    });

    useImperativeHandle(
      swiperRef,
      () => ({
        scrollToIndex,
      }),
      [scrollToIndex]
    );

    const transformStyle = useSwiperTransformStyle(width, height, finalX);

    return (
      <View onLayout={onLayout} style={styles.mainLayout}>
        <GestureDetector gesture={tapGesture}>
          <Animated.View style={transformStyle}>{cards}</Animated.View>
        </GestureDetector>
      </View>
    );
  }
);

export default InfiniteHorizontalSwiper;

const styles = StyleSheet.create({
  mainLayout: { alignSelf: 'stretch', flex: 1 },
});
