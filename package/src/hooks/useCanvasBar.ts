import { RefObject, useEffect } from 'react';

import { startScrollBars } from '../tools/scrollbar.tools';

import '../styles.scss';

export function useCanvasBar(
  containerRef: RefObject<HTMLElement>,
  scrollbarXRef: RefObject<HTMLCanvasElement>,
  scrollbarYRef: RefObject<HTMLCanvasElement>,
) {
  useEffect(() => {
    const container = containerRef.current;
    const scrollbarX = scrollbarXRef.current;
    const scrollbarY = scrollbarYRef.current;

    if (!container || (!scrollbarX && !scrollbarY)) {
      return;
    }

    const instance = startScrollBars(container, scrollbarX, scrollbarY);

    return () => instance?.stop();
  }, [containerRef, scrollbarXRef, scrollbarYRef]);
}
