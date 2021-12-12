import { useEffect, useRef, useState } from 'react';

import { startScrollBars } from '../tools/scrollbar.tools';

export function useCanvasBar() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisibleX, setIsVisibleX] = useState(true);
    const [isVisibleY, setIsVisibleY] = useState(true);
    const scrollbarXRef = useRef<HTMLCanvasElement>(null);
    const scrollbarYRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const scrollbarX = scrollbarXRef.current;
        const scrollbarY = scrollbarYRef.current;

        if (!container || (!scrollbarX && !scrollbarX)) {
            setIsVisibleX(false);
            setIsVisibleY(false);
            return;
        }

        const instance = startScrollBars(container, scrollbarX, scrollbarY);

        setIsVisibleX(!!instance?.isVisibleX);
        setIsVisibleY(!!instance?.isVisibleY);

        return () => instance?.stop();
    }, [containerRef]);

    return {
        containerRef,
        scrollbarXRef,
        scrollbarYRef,
        isVisibleX,
        isVisibleY,
    };
}
