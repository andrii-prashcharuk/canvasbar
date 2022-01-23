import { useLayoutEffect, useRef } from 'react';

import { Config } from '../types';
import { useCanvasBar } from './useCanvasBar';
import { isMobileIOS } from '../tools/browser.tools';

// Currently, it's not possible to customize or turn off root scrollbars in iOS devices
const isMobileIOSDevice = isMobileIOS();

export function useBodyCanvasBar(config?: Partial<Config>) {
  const containerRef = useRef<HTMLElement>(null);
  const scrollbarXRef = useRef<HTMLCanvasElement>(null);
  const scrollbarYRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    if (isMobileIOSDevice) {
      return;
    }

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

  useCanvasBar(containerRef, scrollbarXRef, scrollbarYRef, config);

  useLayoutEffect(() => {
    if (isMobileIOSDevice) {
      return;
    }

    document.body.classList.add('canvasbar-scrollable');
    document.documentElement.classList.add('canvasbar-hide-root-scrollbars');

    return () => {
      document.body.classList.remove('canvasbar-scrollable');
      document.documentElement.classList.remove(
        'canvasbar-hide-root-scrollbars',
      );
    };
  }, []);
}
