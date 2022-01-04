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

function initState({
  element, type, scrollSize, scrollValue, containerSize,
}: InitScrollBarProps): ScrollState | undefined {
  const { width: elementWidth, height: elementHeight } = getElementDimension(element);

  if (!element || !elementWidth || !elementHeight || !scrollSize || scrollSize === containerSize) {
    return;
  }

  const canvasWidth = elementWidth * devicePixelRatio;
  const canvasHeight = elementHeight * devicePixelRatio;
  const scrollBarSize = Math.floor(
    Math.max(DEFAULT_CONFIG.thumbMinSize, containerSize * (containerSize / scrollSize)),
  ) * devicePixelRatio;
  const initialProgress = scrollValue / (scrollSize - containerSize);
  const offset = initialProgress * ((type === 'x' ? canvasWidth : canvasHeight) - scrollBarSize);

  element.width = canvasWidth;
  element.height = canvasHeight;

  return {
    containerSize,
    elementWidth,
    elementHeight,
    canvasWidth,
    canvasHeight,
    scrollSize,
    scrollBarSize,
    offset,
    type,
  };
}

function initScrollBar(props: InitScrollBarProps) {
  const ctx = props.element?.getContext('2d');
  let scrollState = initState(props);

  function render() {
    if (!ctx || !scrollState) {
      return;
    }

    clearCanvas(ctx, scrollState);
    renderThumb(ctx, scrollState, DEFAULT_CONFIG);
  }

  function updateScrollValue(value: number) {
    if (!scrollState) {
      return false;
    }

    const {
      scrollSize, type, canvasWidth, canvasHeight, scrollBarSize, containerSize,
    } = scrollState;
    const progress = value / (scrollSize - containerSize);
    const newTop = progress * ((type === 'x' ? canvasWidth : canvasHeight) - scrollBarSize);

    if (newTop !== scrollState.offset) {
      scrollState.offset = newTop;

      render();

      return true;
    }

    return false;
  }

  function updateContainerSize(containerSize: number, scrollSize: number, scrollValue: number) {
    if (
      (!scrollState && !containerSize)
      || (containerSize === scrollState?.containerSize && scrollSize === scrollState?.scrollSize)
    ) {
      return false;
    }

    scrollState = initState({
      ...props, containerSize, scrollSize, scrollValue,
    });

    render();

    return true;
  }

  function isVisible() {
    return !!scrollState;
  }

  return {
    render, updateScrollValue, updateContainerSize, isVisible,
  };
}

export function startScrollBars(
  container: HTMLElement,
  scrollbarX: HTMLCanvasElement | null,
  scrollbarY: HTMLCanvasElement | null,
) {
  const {
    scrollHeight: scrollSizeY,
    scrollWidth: scrollSizeX,
    scrollTop: scrollValueY,
    scrollLeft: scrollValueX,
    tagName,
    clientHeight: containerHeight,
    clientWidth: containerWidth,
  } = container;
  const isHTML = tagName === 'HTML';
  const scrollXInstance = initScrollBar({
    type: 'x', element: scrollbarX, containerSize: containerWidth, scrollSize: scrollSizeX, scrollValue: scrollValueX,
  });
  const scrollYInstance = initScrollBar({
    type: 'y',
    element: scrollbarY,
    containerSize: containerHeight,
    scrollSize: scrollSizeY,
    scrollValue: scrollValueY,
  });

  let isUpdatingScroll = false;
  let isResizingScroll = false;

  function renderScrollBars() {
    if (!isUpdatingScroll) {
      return;
    }

    const { scrollTop, scrollLeft } = container;
    const isUpdatedX = !!scrollXInstance?.updateScrollValue(scrollLeft);
    const isUpdatedY = !!scrollYInstance?.updateScrollValue(scrollTop);

    isUpdatingScroll = isUpdatedX || isUpdatedY;

    if (isUpdatingScroll) {
      requestAnimationFrame(renderScrollBars);
    }
  }

  function renderContainerClasses() {
    const element = isHTML ? document.body : container.parentElement;

    element.classList.toggle('canvasbar-with-x-scrollbar', scrollXInstance.isVisible());
    element.classList.toggle('canvasbar-with-y-scrollbar', scrollYInstance.isVisible());
  }

  function renderScrollBarsAfterResize() {
    if (!isResizingScroll) {
      return;
    }

    const {
      clientWidth,
      clientHeight,
      scrollHeight,
      scrollWidth,
      scrollTop,
      scrollLeft,
    } = container;
    const isUpdatedX = !!scrollXInstance.updateContainerSize(clientWidth, scrollWidth, scrollLeft);
    const isUpdatedY = !!scrollYInstance.updateContainerSize(clientHeight, scrollHeight, scrollTop);

    renderContainerClasses();

    isResizingScroll = isUpdatedX || isUpdatedY;

    if (isResizingScroll) {
      requestAnimationFrame(renderScrollBarsAfterResize);
    }
  }

  function handleOnScroll() {
    if (isUpdatingScroll) {
      return;
    }

    isUpdatingScroll = true;
    requestAnimationFrame(renderScrollBars);
  }

  function handleOnResize() {
    if (isResizingScroll) {
      return;
    }

    isResizingScroll = true;
    requestAnimationFrame(renderScrollBarsAfterResize);
  }

  const scrollElement = isHTML ? window : container;
  const resizeObserver = new ResizeObserver(handleOnResize);

  scrollElement.addEventListener('scroll', handleOnScroll);

  if (isHTML) {
    window.addEventListener('resize', handleOnResize);
  } else {
    resizeObserver.observe(container);
  }

  scrollXInstance?.render();
  scrollYInstance?.render();

  renderContainerClasses();

  function stop() {
    scrollElement.removeEventListener('scroll', handleOnScroll);

    if (isHTML) {
      window.removeEventListener('resize', handleOnResize);
    } else {
      resizeObserver.unobserve(container);
    }

    isUpdatingScroll = false;
  }

  return { stop };
}
