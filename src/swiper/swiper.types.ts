import type { ReactNode } from 'react';

export type RenderItem = (index: number, isFocused: boolean) => ReactNode;

export type SwiperProps = {
  /**
   * Function to render the card. It receives the index of the card and a boolean
   * indicating if the card is currently focused. The function should return a
   * ReactNode.
   */
  renderItem: RenderItem;
  /**
   * The number of cards to render at once. Must be an odd number greater than 1.
   * This can be used to control how many components are rendered at once,
   * which helps with performance. Tweak this number to find the best * performance
   * for your use case.
   *
   * @default 3
   */
  windowSize?: number;
  /**
   * When the index changes, this callback will be called with the new index.
   * Note: This needs to be a worklet function.
   */
  onIndexChangedWorklet?: (index: number) => void;
};

export interface SwiperMethods {
  /**
   * Scroll to the card at the given index.
   */
  scrollToIndex: (index: number) => void;
}
