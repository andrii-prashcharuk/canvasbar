import { DEFAULT_CONFIG } from '../config';
import { ScrollState, ScrollType } from '../types';
import { clearCanvas, getElementDimension, renderThumb } from './canvas.tools';

const { devicePixelRatio } = window;

interface InitScrollBarProps {
    element: HTMLCanvasElement | null,
    type: ScrollType,
    scrollSize: number;
    scrollValue: number;
    containerSize: number;
}

function initScrollBar({
  element, type, scrollSize, scrollValue, containerSize,
}: InitScrollBarProps) {
  const { width: elementWidth, height: elementHeight } = getElementDimension(element);
  const ctx = element?.getContext('2d');

  if (!element || !ctx || !elementWidth || !elementHeight || !scrollSize || scrollSize === containerSize) {
    return;
  }

  const canvasWidth = elementWidth * devicePixelRatio;
  const canvasHeight = elementHeight * devicePixelRatio;
  const scrollBarSize = Math.floor(
    Math.max(DEFAULT_CONFIG.thumbMinSize, containerSize * (containerSize / scrollSize)),
  ) * devicePixelRatio;
  const initialProgress = scrollValue / (scrollSize - containerSize);
  const offset = initialProgress * ((type === 'x' ? canvasWidth : canvasHeight) - scrollBarSize);

  const scrollState: ScrollState = {
    elementWidth,
    elementHeight,
    canvasWidth,
    canvasHeight,
    scrollSize,
    scrollBarSize,
    offset,
    type,
  };

  element.width = scrollState.canvasWidth;
  element.height = scrollState.canvasHeight;

  function render() {
    if (!ctx) {
      return;
    }

    clearCanvas(ctx, scrollState);
    renderThumb(ctx, scrollState, DEFAULT_CONFIG);
  }

  function updateScrollValue(value: number) {
    const progress = value / (scrollSize - containerSize);
    const newTop = progress * ((type === 'x' ? canvasWidth : canvasHeight) - scrollBarSize);

    if (newTop !== scrollState.offset) {
      scrollState.offset = newTop;

      render();

      return true;
    }

    return false;
  }

  return { render, updateScrollValue };
}

export function startScrollBars(
  container: HTMLElement,
  scrollbarX: HTMLCanvasElement | null,
  scrollbarY: HTMLCanvasElement | null,
) {
  const {
    scrollHeight,
    scrollWidth,
    scrollTop: scrollValueY,
    scrollLeft: scrollValueX,
    tagName,
    clientHeight,
    clientWidth,
  } = container;
  const isHTML = tagName === 'HTML';
  const scrollXInstance = initScrollBar({
    type: 'x', element: scrollbarX, containerSize: clientWidth, scrollSize: scrollWidth, scrollValue: scrollValueX,
  });
  const scrollYInstance = initScrollBar({
    type: 'y',
    element: scrollbarY,
    containerSize: clientHeight,
    scrollSize: scrollHeight,
    scrollValue: scrollValueY,
  });

  if (!scrollXInstance && !scrollYInstance) {
    return;
  }

  let isUpdatingScroll = false;

  function renderScrollBars() {
    if (!isUpdatingScroll) {
      return;
    }

    const { scrollTop, scrollLeft } = container;
    const isUpdatedX = !!scrollXInstance?.updateScrollValue(scrollLeft);
    const isUpdatedY = !!scrollYInstance?.updateScrollValue(scrollTop);

    isUpdatingScroll = isUpdatedX || isUpdatedY || true;

    if (isUpdatingScroll) {
      requestAnimationFrame(renderScrollBars);
    }
  }

  function handleOnScroll() {
    if (isUpdatingScroll) {
      return;
    }

    isUpdatingScroll = true;
    requestAnimationFrame(renderScrollBars);
  }

  const scrollElement = isHTML ? window : container;

  scrollElement.addEventListener('scroll', handleOnScroll);

  scrollXInstance?.render();
  scrollYInstance?.render();

  function stop() {
    scrollElement.removeEventListener('scroll', handleOnScroll);
    isUpdatingScroll = false;
  }

  return { stop, isVisibleX: !!scrollXInstance, isVisibleY: !!scrollYInstance };
}
