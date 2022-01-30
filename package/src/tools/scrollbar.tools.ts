import { DEFAULT_CONFIG } from '../config';
import { Config, ScrollState, ScrollType } from '../types';
import {
  clearCanvas, getElementDimension, isClickedOnThumb, renderThumb,
} from './canvas.tools';

const { devicePixelRatio } = window;

interface InitScrollBarProps {
  element: HTMLCanvasElement | null,
  type: ScrollType,
  scrollSize: number;
  scrollValue: number;
  containerSize: number;
  config: Config;
  onScrollValueChange: (value: number) => void;
}

function initState({
  element, type, scrollSize, scrollValue, containerSize, config,
}: InitScrollBarProps): ScrollState | undefined {
  const { width: elementWidth, height: elementHeight } = getElementDimension(element);

  if (!element || !elementWidth || !elementHeight || !scrollSize || scrollSize === containerSize) {
    return;
  }

  const canvasWidth = elementWidth * devicePixelRatio;
  const canvasHeight = elementHeight * devicePixelRatio;
  const scrollBarSize = Math.floor(
    Math.max(config.thumbMinSize, containerSize * (containerSize / scrollSize)),
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
    scrollValue,
  };
}

function initScrollBar(props: InitScrollBarProps) {
  const ctx = props.element?.getContext('2d');
  let scrollState = initState(props);
  let lastMousePosition: number | null = null;
  let isWaitingForScrollValueUpdate = false;

  function handleOnMouseDown(event: MouseEvent) {
    const {
      offsetX, offsetY, screenX, screenY,
    } = event;

    event.preventDefault();

    if (isClickedOnThumb(offsetX * devicePixelRatio, offsetY * devicePixelRatio, scrollState)) {
      lastMousePosition = props.type === 'x' ? screenX : screenY;
    } else {
      const currentPosition = props.type === 'x' ? offsetX : offsetY;
      const {
        scrollBarSize, scrollValue, scrollSize, containerSize, canvasHeight, canvasWidth,
      } = scrollState;
      const scrollElementSize = (props.type === 'x' ? canvasWidth : canvasHeight) / devicePixelRatio;
      const thumbSize = scrollBarSize / devicePixelRatio;
      const currentPositionPercent = currentPosition / (scrollElementSize - thumbSize);
      const maxScrollValue = scrollSize - containerSize;
      const newScrollValue = currentPositionPercent * (scrollSize - containerSize) - containerSize / 2;
      const newValidScrollValue = Math.round(Math.max(0, Math.min(newScrollValue, maxScrollValue)));

      if (scrollValue !== newValidScrollValue) {
        lastMousePosition = props.type === 'x' ? screenX : screenY;
        isWaitingForScrollValueUpdate = true;
        props.onScrollValueChange(newValidScrollValue);
      }
    }
  }

  function handleOnMouseUp() {
    lastMousePosition = null;
  }

  function handleOnMouseMove({ screenX, screenY }: MouseEvent) {
    if (lastMousePosition !== null && !isWaitingForScrollValueUpdate) {
      const currentPosition = props.type === 'x' ? screenX : screenY;

      if (lastMousePosition === currentPosition) {
        return;
      }

      const {
        scrollBarSize, scrollValue, scrollSize, containerSize, canvasHeight, canvasWidth,
      } = scrollState;
      const scrollElementSize = (props.type === 'x' ? canvasWidth : canvasHeight) / devicePixelRatio;
      const diff = currentPosition - lastMousePosition;
      const thumbSize = scrollBarSize / devicePixelRatio;
      const diffPercent = diff / (scrollElementSize - thumbSize);
      const maxScrollValue = scrollSize - containerSize;
      const newScrollValue = scrollValue + diffPercent * maxScrollValue;
      const newValidScrollValue = Math.round(Math.max(0, Math.min(newScrollValue, maxScrollValue)));

      if (scrollValue !== newValidScrollValue) {
        lastMousePosition = currentPosition;
        isWaitingForScrollValueUpdate = true;
        props.onScrollValueChange(newValidScrollValue);
      }
    }
  }

  function render() {
    if (!ctx || !scrollState) {
      return;
    }

    clearCanvas(ctx, scrollState);
    renderThumb(ctx, scrollState, props.config);
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
      scrollState.scrollValue = value;
      scrollState.offset = newTop;
      isWaitingForScrollValueUpdate = false;

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

  function stop() {
    props.element.removeEventListener('mousedown', handleOnMouseDown);
    window.removeEventListener('mousemove', handleOnMouseMove);
    window.removeEventListener('mouseup', handleOnMouseUp);
  }

  props.element.addEventListener('mousedown', handleOnMouseDown);
  window.addEventListener('mousemove', handleOnMouseMove);
  window.addEventListener('mouseup', handleOnMouseUp);

  return {
    render, updateScrollValue, updateContainerSize, isVisible, stop,
  };
}

export function startScrollBars(
  container: HTMLElement,
  scrollbarX: HTMLCanvasElement | null,
  scrollbarY: HTMLCanvasElement | null,
  propsConfig?: Partial<Config>,
) {
  const config = { ...DEFAULT_CONFIG, ...propsConfig };
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
  const getHandleOnScrollValueChange = (type: ScrollType) => (newValue: number) => {
    requestAnimationFrame(() => {
      container[type === 'x' ? 'scrollLeft' : 'scrollTop'] = newValue;
    });
  };
  const scrollXInstance = initScrollBar({
    type: 'x',
    element: scrollbarX,
    containerSize: containerWidth,
    scrollSize: scrollSizeX,
    scrollValue: scrollValueX,
    config,
    onScrollValueChange: getHandleOnScrollValueChange('x'),
  });
  const scrollYInstance = initScrollBar({
    type: 'y',
    element: scrollbarY,
    containerSize: containerHeight,
    scrollSize: scrollSizeY,
    scrollValue: scrollValueY,
    config,
    onScrollValueChange: getHandleOnScrollValueChange('y'),
  });

  let isUpdatingScroll = false;
  let isResizingScroll = false;

  function renderScrollBars() {
    if (!isUpdatingScroll) {
      return;
    }

    const { scrollTop, scrollLeft } = container;
    const isUpdatedX = scrollXInstance.updateScrollValue(scrollLeft);
    const isUpdatedY = scrollYInstance.updateScrollValue(scrollTop);

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
    resizeObserver.observe(document.body);
  } else {
    resizeObserver.observe(container);
  }

  scrollXInstance.render();
  scrollYInstance.render();

  renderContainerClasses();

  function stop() {
    scrollElement.removeEventListener('scroll', handleOnScroll);

    if (isHTML) {
      window.removeEventListener('resize', handleOnResize);
      resizeObserver.unobserve(document.body);
    } else {
      resizeObserver.unobserve(container);
    }

    isUpdatingScroll = false;
  }

  return { stop };
}
