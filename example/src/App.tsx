import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRef } from 'react';
import InfiniteHorizontalSwiper, {
  type SwiperMethods,
} from '@sunsama/infinite-horizontal-swiper';

const renderItem = (index: number, focused: boolean) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: index % 2 === 0 ? 'blue' : 'red',
      }}
    >
      <Text style={{ color: 'white', fontSize: 80 }}>{index}</Text>
      <Text style={{ color: 'white', fontSize: 30 }}>
        {focused ? '(is focused)' : ''}
      </Text>
    </View>
  );
};

export default function App() {
  const swiperRef = useRef<SwiperMethods>(null);
  const swiperRef2 = useRef<SwiperMethods>(null);

  const onPressRandomIndex = () => {
    swiperRef.current?.scrollToIndex(500 - Math.floor(Math.random() * 1000));
    swiperRef2.current?.scrollToIndex(500 - Math.floor(Math.random() * 1000));
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <InfiniteHorizontalSwiper
          ref={swiperRef2}
          windowSize={5}
          renderItem={renderItem}
        />
      </View>
      <Pressable style={{ marginBottom: 30 }} onPress={onPressRandomIndex}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 30,
            alignSelf: 'stretch',
          }}
        >
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
});
