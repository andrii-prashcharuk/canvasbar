import {
  HTMLAttributes, createElement, RefObject, useRef,
} from 'react';

import { useCanvasBar } from '../hooks/useCanvasBar';

interface Props<Element> extends HTMLAttributes<Element> {
  as?: string;
}

export function CanvasBar<Element extends HTMLElement = HTMLElement>({
  as = 'div', className, children, ...props
}: Props<Element>): JSX.Element {
  const containerRef = useRef<HTMLElement>(null);
  const scrollbarXRef = useRef<HTMLCanvasElement>(null);
  const scrollbarYRef = useRef<HTMLCanvasElement>(null);

  useCanvasBar(containerRef, scrollbarXRef, scrollbarYRef);

  return createElement(
    as,
    {
      ...props,
      className: `canvasbar-wrapper ${className}`,
    }, (
      <>
        <div ref={containerRef as RefObject<HTMLDivElement>} className="canvasbar-scrollable">{children}</div>
        <canvas ref={scrollbarYRef} className="canvasbar-scrollbar-y" />
        <canvas ref={scrollbarXRef} className="canvasbar-scrollbar-x" />
      </>
    ),
  );
}
