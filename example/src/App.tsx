import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useCallback, useRef } from 'react';
import InfiniteHorizontalSwiper, {
  type SwiperMethods,
} from '@sunsama/infinite-horizontal-swiper';

export default function App() {
  const swiperRef = useRef<SwiperMethods>(null);
  const swiperRef2 = useRef<SwiperMethods>(null);

  const onPressRandomIndex = () => {
    swiperRef.current?.scrollToIndex(500 - Math.floor(Math.random() * 1000));
    swiperRef2.current?.scrollToIndex(500 - Math.floor(Math.random() * 1000));
  };

  const onIndexChangedWorklet = useCallback((index: number) => {
    'worklet';
    console.log('index changed to', index);
  }, []);

  const renderItem = useCallback((index: number, focused: boolean) => {
    const styleView = [
      styles.renderView,
      {
        backgroundColor: index % 2 === 0 ? 'blue' : 'red',
      },
    ];

    return (
      <View style={styleView}>
        <Text style={styles.renderText}>{index}</Text>
        <Text style={styles.renderTextFocused}>
          {focused ? '(is focused)' : ''}
        </Text>
      </View>
    );
  }, []);

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <InfiniteHorizontalSwiper
          ref={swiperRef2}
          windowSize={5}
          renderItem={renderItem}
          onIndexChangedWorklet={onIndexChangedWorklet}
        />
      </View>
      <Pressable style={styles.button} onPress={onPressRandomIndex}>
        <View style={styles.buttonView}>
          <Text>Focus Random Index</Text>
        </View>
      </Pressable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginBottom: 30,
  },
  buttonView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    alignSelf: 'stretch',
  },
  renderText: {
    color: 'white',
    fontSize: 80,
  },
  renderTextFocused: {
    color: 'white',
    fontSize: 30,
  },
  renderView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
