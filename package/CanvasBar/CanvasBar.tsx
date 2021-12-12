import { HTMLAttributes, createElement } from 'react';

import { useCanvasBar } from '../hooks/useCanvasBar';

interface Props<Element> extends HTMLAttributes<Element> {
    as?: string;
    config?: Object
}

export function CanvasBar<Element extends HTMLElement = HTMLElement>({ config, as = 'div', className, children, ...props }: Props<Element>) {
    const { scrollbarXRef, scrollbarYRef, isVisibleX, isVisibleY, containerRef } = useCanvasBar();
    const classes = [
        'canvasbar-wrapper',
        className,
        isVisibleX && 'canvasbar-with-x-scrollbar',
        isVisibleY && 'canvasbar-with-y-scrollbar',
    ].filter(Boolean).join(' ');

    return createElement(as, {
        ...props,
        className: classes,
    }, (
        <>
            <div ref={containerRef} className='canvasbar-scrollable'>{children}</div>
            <canvas ref={scrollbarYRef} className='canvasbar-scrollbar-y'/>
            <canvas ref={scrollbarXRef} className='canvasbar-scrollbar-x'/>
        </>
    ));
}
