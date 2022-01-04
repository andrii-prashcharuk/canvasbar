export interface Config {
  thumbColor: string;
  thumbBorderRadius: number | 'auto';
  thumbMinSize: number;
  padding: number;
}

export type ScrollType = 'x' | 'y';

export interface ScrollState {
  elementWidth: number;
  elementHeight: number;
  canvasWidth: number;
  canvasHeight: number;
  scrollSize: number;
  scrollBarSize: number;
  offset: number;
  type: ScrollType;
  containerSize: number;
}
