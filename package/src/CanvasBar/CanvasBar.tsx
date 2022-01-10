import {
  HTMLAttributes, createElement, RefObject, useRef,
} from 'react';

import { Config } from '../types';

import { useCanvasBar } from '../hooks/useCanvasBar';

interface Props<Element> extends HTMLAttributes<Element> {
  as?: string;
  config?: Partial<Config>,
  wrapperRef?: RefObject<Element>,
  scrollableRef?: RefObject<HTMLDivElement>,
}

export function CanvasBar<Element extends HTMLElement = HTMLElement>({
  as = 'div', wrapperRef, scrollableRef, config, className, children, ...props
}: Props<Element>): JSX.Element {
  const createdContainerRef = useRef<HTMLElement>(null);
  const containerRef = scrollableRef ?? createdContainerRef;
  const scrollbarXRef = useRef<HTMLCanvasElement>(null);
  const scrollbarYRef = useRef<HTMLCanvasElement>(null);

  useCanvasBar(containerRef, scrollbarXRef, scrollbarYRef, config);

  return createElement(
    as,
    {
      ...props,
      className: `canvasbar-wrapper ${className}`,
      ref: wrapperRef,
    }, (
      <>
        <div ref={containerRef as RefObject<HTMLDivElement>} className="canvasbar-scrollable">{children}</div>
        <canvas ref={scrollbarYRef} className="canvasbar-scrollbar-y" />
        <canvas ref={scrollbarXRef} className="canvasbar-scrollbar-x" />
      </>
    ),
  );
}
