import { RefObject, useContext, useEffect } from 'react';

import { Config } from '../types';
import { CanvasBarConfigContext } from '../CanvasBarConfig.context';
import { startScrollBars } from '../tools/scrollbar.tools';

import '../styles.scss';

export function useCanvasBar(
  containerRef: RefObject<HTMLElement>,
  scrollbarXRef: RefObject<HTMLCanvasElement>,
  scrollbarYRef: RefObject<HTMLCanvasElement>,
  propsConfig?: Partial<Config>,
) {
  const config = useContext(CanvasBarConfigContext) ?? propsConfig;

  useEffect(() => {
    const container = containerRef.current;
    const scrollbarX = scrollbarXRef.current;
    const scrollbarY = scrollbarYRef.current;

    if (!container || (!scrollbarX && !scrollbarY)) {
      return;
    }

    const instance = startScrollBars(container, scrollbarX, scrollbarY, config);

    return () => instance?.stop();
  }, [containerRef, scrollbarXRef, scrollbarYRef, config]);
}
