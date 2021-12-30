import {
  RefObject, useEffect, useState,
} from 'react';

import { startScrollBars } from '../tools/scrollbar.tools';

import '../styles.scss';

export function useCanvasBar(
  containerRef: RefObject<HTMLElement>,
  scrollbarXRef: RefObject<HTMLCanvasElement>,
  scrollbarYRef: RefObject<HTMLCanvasElement>,
) {
  const [isVisibleX, setIsVisibleX] = useState(true);
  const [isVisibleY, setIsVisibleY] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    const scrollbarX = scrollbarXRef.current;
    const scrollbarY = scrollbarYRef.current;

    if (!container || (!scrollbarX && !scrollbarY)) {
      setIsVisibleX(false);
      setIsVisibleY(false);
      return;
    }

    const instance = startScrollBars(container, scrollbarX, scrollbarY);

    setIsVisibleX(!!instance?.isVisibleX);
    setIsVisibleY(!!instance?.isVisibleY);

    return () => instance?.stop();
  }, [containerRef, scrollbarXRef, scrollbarYRef]);

  return {
    containerRef,
    scrollbarXRef,
    scrollbarYRef,
    isVisibleX,
    isVisibleY,
  };
}
