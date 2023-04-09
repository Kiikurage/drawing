import { memo } from 'react';
import { HoverState } from '@drawing/common';
import { useEditor } from '../EditorControllerContext';
import { COLOR_SELECTION } from '../../../../styles';

export const ResizeHandle = memo(
    ({ x = 0, y = 0, hover, cursor }: { x?: number; y?: number; hover: HoverState; cursor: string }) => {
        const editor = useEditor();

        return (
            <g transform={`translate(${x},${y})`}>
                <rect
                    cursor={cursor}
                    x={-12}
                    y={-12}
                    width={24}
                    height={24}
                    onMouseOver={() => editor.handleHover(hover)}
                    onMouseLeave={editor.handleUnhover}
                    pointerEvents="all"
                    fill="none"
                    stroke="none"
                />
                <rect x={-5} y={-5} width={10} height={10} fill="#fff" stroke={COLOR_SELECTION} strokeWidth={1.5} />
            </g>
        );
    }
);

export const InvisibleResizeHandle = memo(
    ({
        x = 0,
        y = 0,
        width = 0,
        height = 0,
        hover,
        cursor,
    }: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        hover: HoverState;
        cursor: string;
    }) => {
        const editor = useEditor();

        return (
            <rect
                cursor={cursor}
                x={x - 12}
                y={y - 12}
                width={width + 24}
                height={height + 24}
                onMouseOver={() => editor.handleHover(hover)}
                onMouseLeave={editor.handleUnhover}
                pointerEvents="all"
                fill="none"
                stroke="none"
            />
        );
    }
);