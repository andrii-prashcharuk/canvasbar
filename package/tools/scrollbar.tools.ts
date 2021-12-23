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

function initScrollBar({ element, type, scrollSize, scrollValue, containerSize }: InitScrollBarProps) {
    const { width: elementWidth, height: elementHeight } = getBoundingClientRectFromElement(element);
    const ctx = element?.getContext('2d');

    if (!element || !ctx || !elementWidth || !elementHeight || !scrollSize || scrollSize === containerSize) {
        return;
    }

    const canvasWidth = elementWidth * devicePixelRatio;
    const canvasHeight = elementHeight * devicePixelRatio;
    const scrollBarSize = Math.floor(Math.max(MIN_SIZE, containerSize * (containerSize / scrollSize))) * devicePixelRatio;
    const progress = scrollValue / (scrollSize - containerSize);
    const offset = progress * ((type === 'x' ? canvasWidth : canvasHeight) - scrollBarSize);

    const scrollState: ScrollState = {
        elementWidth,
        elementHeight,
        canvasWidth,
        canvasHeight,
        scrollSize,
        scrollBarSize,
        offset,
    };

    element.width = scrollState.canvasWidth;
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

export function startScrollBars(container: HTMLDivElement, scrollbarX: HTMLCanvasElement | null, scrollbarY: HTMLCanvasElement | null) {
    const { scrollHeight, scrollWidth, scrollTop, scrollLeft, clientHeight, clientWidth } = container;
    const scrollXInstance = initScrollBar({ type: 'x', element: scrollbarX, containerSize: clientWidth, scrollSize: scrollWidth, scrollValue: scrollLeft })
    const scrollYInstance = initScrollBar({ type: 'y', element: scrollbarY, containerSize: clientHeight, scrollSize: scrollHeight, scrollValue: scrollTop })

    if (!scrollXInstance && !scrollYInstance) {
        return;
    }

    let isUpdatingScroll = false;

    function renderScrollBars() {
        const { scrollTop, scrollLeft } = container;
        const isUpdatedX = !!scrollXInstance?.updateScrollValue(scrollLeft);
        const isUpdatedY = !!scrollYInstance?.updateScrollValue(scrollTop);

        isUpdatingScroll = isUpdatedX || isUpdatedY;

        if (isUpdatingScroll) {
            requestAnimationFrame(renderScrollBars);
        }
    }

    function handleOnScroll() {
        if (isUpdatingScroll) {
            return;
        }

        requestAnimationFrame(renderScrollBars);
    }

    container.addEventListener('scroll', handleOnScroll);

    scrollXInstance?.render();
    scrollYInstance?.render();

    function stop() {
        container.removeEventListener('scroll', handleOnScroll);
    }

    return { stop, isVisibleX: !!scrollXInstance, isVisibleY: !!scrollYInstance };
}
