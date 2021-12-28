import {
  useLayoutEffect, useRef,
} from 'react';

import { useCanvasBar } from './useCanvasBar';

export function useBodyCanvasBar() {
  const containerRef = useRef<HTMLElement>(null);
  const scrollbarXRef = useRef<HTMLCanvasElement>(null);
  const scrollbarYRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    containerRef.current = document.documentElement;
    scrollbarXRef.current = document.createElement('canvas');
    scrollbarYRef.current = document.createElement('canvas');
    scrollbarXRef.current.className = 'canvasbar-scrollbar-x';
    scrollbarYRef.current.className = 'canvasbar-scrollbar-y';

    document.body.append(scrollbarXRef.current, scrollbarYRef.current);

    return () => {
      scrollbarXRef.current.remove();
      scrollbarYRef.current.remove();
      scrollbarXRef.current = null;
      scrollbarYRef.current = null;
      containerRef.current = null;
    };
  }, [containerRef, scrollbarXRef, scrollbarYRef]);

  const { isVisibleX, isVisibleY } = useCanvasBar(containerRef, scrollbarXRef, scrollbarYRef);

  useLayoutEffect(() => {
    const classes = [
      'canvasbar-scrollable',
      isVisibleX && 'canvasbar-with-x-scrollbar',
      isVisibleY && 'canvasbar-with-y-scrollbar',
    ].filter(Boolean);

    document.body.classList.add(...classes);
    document.documentElement.classList.add('canvasbar-hide-global-scrollbars');

    return () => {
      document.body.classList.remove(...classes);
      document.documentElement.classList.remove(
        'canvasbar-hide-global-scrollbars',
      );
    };
  }, [isVisibleX, isVisibleY]);
}
