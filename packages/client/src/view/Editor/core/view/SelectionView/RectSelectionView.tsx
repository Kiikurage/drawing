import { useEditorController, useExtension } from '../EditorControllerContext';
import { useSlice } from '../../../../hooks/useStore';
import { Box, Entity, HoverState } from '@drawing/common';
import { css } from '@linaria/core';
import { COLOR_SELECTION } from '../../../../styles';
import { InvisibleResizeHandle, ResizeHandle } from './ResizeHandle';
import { SelectExtension } from '../../../features/select/SelectExtension';
import { useMemo } from 'react';

export const RectSelectionView = () => {
    const selectExtension = useExtension(SelectExtension);
    const { selectionBoundingBox } = useSlice(selectExtension.store, (state) => ({
        selectionBoundingBox: Entity.computeBoundingBox(state.entities),
    }));

    const controller = useEditorController();
    const { camera } = useSlice(controller.store, (state) => ({ camera: state.camera }));

    const { x, y, width, height } = useMemo(() => {
        const selectionBoundingBoxInDisplay = Box.toDisplay(camera, selectionBoundingBox);
        return {
            x: selectionBoundingBoxInDisplay.point.x,
            y: selectionBoundingBoxInDisplay.point.y,
            width: selectionBoundingBoxInDisplay.size.width,
            height: selectionBoundingBoxInDisplay.size.height,
        };
    }, [camera, selectionBoundingBox]);

    return (
        <svg
            className={css`
                position: absolute;
                top: 0;
                left: 0;
            `}
            width="100%"
            height="100%"
        >
            <g transform={`translate(${x},${y})`}>
                <rect
                    cursor="move"
                    pointerEvents="all"
                    width={width}
                    height={height}
                    fill="none"
                    stroke={COLOR_SELECTION}
                    strokeWidth={1.5}
                    onMouseOver={() => controller.onHover(HoverState.TRANSLATE_HANDLE)}
                    onMouseLeave={() => controller.onUnhover()}
                />
                <InvisibleResizeHandle cursor="ns-resize" width={width} hover={HoverState.RESIZE_HANDLE_TOP} />
                <InvisibleResizeHandle cursor="ew-resize" height={height} hover={HoverState.RESIZE_HANDLE_LEFT} />
                <InvisibleResizeHandle
                    cursor="ew-resize"
                    x={width}
                    height={height}
                    hover={HoverState.RESIZE_HANDLE_RIGHT}
                />
                <InvisibleResizeHandle
                    cursor="ns-resize"
                    y={height}
                    width={width}
                    hover={HoverState.RESIZE_HANDLE_BOTTOM}
                />
                <ResizeHandle cursor="nwse-resize" hover={HoverState.RESIZE_HANDLE_TOP_LEFT} />
                <ResizeHandle cursor="nesw-resize" x={width} hover={HoverState.RESIZE_HANDLE_TOP_RIGHT} />
                <ResizeHandle cursor="nesw-resize" y={height} hover={HoverState.RESIZE_HANDLE_BOTTOM_LEFT} />
                <ResizeHandle cursor="nwse-resize" x={width} y={height} hover={HoverState.RESIZE_HANDLE_BOTTOM_RIGHT} />
            </g>
        </svg>
    );
};
