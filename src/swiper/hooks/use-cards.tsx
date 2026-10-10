import type { CardState, RenderItem } from '../swiper.types';
import { useMemo } from 'react';
import SwiperCard from '../components/swiper-card';

const useCards = (
  windowSize: number,
  renderItem: RenderItem,
  cardState: CardState,
  cardWidth: number,
  visibleCount: number
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
          cardWidth={cardWidth}
          visibleCount={visibleCount}
        />
      )),
    [windowSize, renderItem, cardState, cardWidth, visibleCount]
  );

export default useCards;
