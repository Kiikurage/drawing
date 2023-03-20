import { memo, useCallback } from 'react';
import { COLOR_SELECTION } from '../../../styles';
import { useEditorController } from '../../EditorControllerContext';
import { TransformHandleHoverState } from '../../model/HoverState';

export const ResizeHandle = memo(
    ({ x = 0, y = 0, hover, cursor }: { x?: number; y?: number; hover: TransformHandleHoverState; cursor: string }) => {
        const controller = useEditorController();

        const onHover = useCallback(() => {
            controller.onHover(hover);
        }, [controller, hover]);

        const onUnhover = useCallback(() => {
            controller.onUnhover();
        }, [controller]);

        return (
            <g transform={`translate(${x},${y})`}>
                <rect
                    cursor={cursor}
                    x={-12}
                    y={-12}
                    width={24}
                    height={24}
                    onMouseOver={onHover}
                    onMouseLeave={onUnhover}
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
        hover: TransformHandleHoverState;
        cursor: string;
    }) => {
        const controller = useEditorController();

        const onHover = useCallback(() => {
            controller.onHover(hover);
        }, [controller, hover]);

        const onUnhover = useCallback(() => {
            controller.onUnhover();
        }, [controller]);

        return (
            <rect
                cursor={cursor}
                x={x - 12}
                y={y - 12}
                width={width + 24}
                height={height + 24}
                onMouseOver={onHover}
                onMouseLeave={onUnhover}
                pointerEvents="all"
                fill="none"
                stroke="none"
            />
        );
    }
);
