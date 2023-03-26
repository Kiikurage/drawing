import { css } from '@linaria/core';
import { Box } from '../../../../model/Box';
import { Entity } from '../../../../model/entity/Entity';
import { COLOR_SELECTION } from '../../../styles';
import { useEditorController } from '../../EditorControllerContext';
import { Camera } from '../../model/Camera';
import { EntityMap } from '../../model/EntityMap';
import { HoverState } from '../../model/HoverState';
import { InvisibleResizeHandle, ResizeHandle } from './ResizeHandle';

export const RectSelectionView = ({ camera, selectedEntities }: { camera: Camera; selectedEntities: EntityMap }) => {
    const controller = useEditorController();

    const {
        point: { x, y },
        size: { width, height },
    } = Box.toDisplay(camera, Entity.computeBoundingBox(selectedEntities));

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
