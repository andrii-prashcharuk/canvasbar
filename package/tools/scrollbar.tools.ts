const { devicePixelRatio } = window;

type ScrollType = 'x' | 'y';

interface ScrollState {
  elementWidth: number;
  elementHeight: number;
  canvasWidth: number;
  canvasHeight: number;
  scrollSize: number;
  scrollBarSize: number;
  offset: number;
}

const MIN_SIZE = 20;

function getBoundingClientRectFromElement(element: HTMLCanvasElement | null) {
  return element?.getBoundingClientRect() ?? { width: 0, height: 0 };
}

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
  const { width: elementWidth, height: elementHeight } = getBoundingClientRectFromElement(element);
  const ctx = element?.getContext('2d');

  if (!element || !ctx || !elementWidth || !elementHeight || !scrollSize || scrollSize === containerSize) {
    return;
  }

  const canvasWidth = elementWidth * devicePixelRatio;
  const canvasHeight = elementHeight * devicePixelRatio;
  const scrollBarSize = Math.floor(
    Math.max(MIN_SIZE, containerSize * (containerSize / scrollSize)),
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
  };

  // eslint-disable-next-line no-param-reassign
  element.width = scrollState.canvasWidth;
  // eslint-disable-next-line no-param-reassign
  element.height = scrollState.canvasHeight;

  function render() {
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, scrollState.canvasWidth, scrollState.canvasHeight);

    if (type === 'x') {
      ctx.fillRect(scrollState.offset, 0, scrollState.scrollBarSize, scrollState.canvasHeight);
    } else {
      ctx.fillRect(0, scrollState.offset, scrollState.canvasWidth, scrollState.scrollBarSize);
    }
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
