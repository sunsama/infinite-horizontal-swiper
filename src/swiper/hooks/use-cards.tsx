import type { RenderItem } from '../swiper.types';
import type { CardState } from '../hooks/use-card-state';
import { useMemo } from 'react';
import SwiperCard from '../components/swiper-card';

const useCards = (
  windowSize: number,
  renderItem: RenderItem,
  cardState: CardState
) =>
  useMemo(
    () =>
      Array.from({ length: windowSize }, (_, i) => (
        <SwiperCard
          key={`card-${i}`}
          renderItem={renderItem}
          translateX={cardState.translateX[i]!}
          index={cardState.cardIndexes[i]!}
          activeIndex={cardState.index}
        />
      )),
    [windowSize, renderItem, cardState]
  );

export default useCards;
