import { css } from '@emotion/react';
import { Box } from '../../../../model/Box';
import { Entity } from '../../../../model/entity/Entity';
import { COLOR_SELECTION } from '../../../styles';
import { useEditorController } from '../../EditorControllerContext';
import { Camera } from '../../model/Camera';
import { TransformHandleHoverState } from '../../model/HoverState';
import { ResizeHandle } from './ResizeHandle';

export const RectSelectionView = ({ camera, selectedEntities }: { camera: Camera; selectedEntities: Entity[] }) => {
    const controller = useEditorController();

    const {
        point: { x, y },
        size: { width, height },
    } = Box.toDisplay(camera, Entity.computeBoundingBox(selectedEntities));

    return (
        <svg
            css={css`
                position: absolute;
                left: ${x - 100}px;
                top: ${y - 100}px;
            `}
            width={width + 200}
            height={height + 200}
        >
            <rect
                cursor="move"
                pointerEvents="all"
                x="100"
                y="100"
                width={width}
                height={height}
                fill="transparent"
                stroke={COLOR_SELECTION}
                strokeWidth={1.5}
                onMouseDown={() => controller.onHover(TransformHandleHoverState.TRANSLATE)}
                onMouseLeave={() => controller.onUnhover()}
            />
            <ResizeHandle
                cursor="nwse-resize"
                x="96"
                y="96"
                onMouseOver={() => controller.onHover(TransformHandleHoverState.RESIZE_TOP_LEFT)}
                onMouseLeave={() => controller.onUnhover()}
            />
            <ResizeHandle
                cursor="ns-resize"
                x="105"
                y="96"
                onMouseOver={() => controller.onHover(TransformHandleHoverState.RESIZE_TOP)}
                onMouseLeave={() => controller.onUnhover()}
            />
            <ResizeHandle
                cursor="nesw-resize"
                x={96 + width}
                y="96"
                onMouseOver={() => controller.onHover(TransformHandleHoverState.RESIZE_TOP_RIGHT)}
                onMouseLeave={() => controller.onUnhover()}
            />
            <ResizeHandle
                cursor="ew-resize"
                x="96"
                y="105"
                onMouseOver={() => controller.onHover(TransformHandleHoverState.RESIZE_LEFT)}
                onMouseLeave={() => controller.onUnhover()}
            />
            <ResizeHandle
                cursor="ew-resize"
                x={96 + width}
                y="105"
                onMouseDown={() => controller.onHover(TransformHandleHoverState.RESIZE_RIGHT)}
                onMouseLeave={() => controller.onUnhover()}
            />
            <ResizeHandle
                cursor="nesw-resize"
                x="96"
                y={96 + height}
                onMouseDown={() => controller.onHover(TransformHandleHoverState.RESIZE_BOTTOM_LEFT)}
                onMouseLeave={() => controller.onUnhover()}
            />
            <ResizeHandle
                cursor="ns-resize"
                x="105"
                y={96 + height}
                onMouseDown={() => controller.onHover(TransformHandleHoverState.RESIZE_BOTTOM)}
                onMouseLeave={() => controller.onUnhover()}
            />
            <ResizeHandle
                cursor="nwse-resize"
                x={96 + width}
                y={96 + height}
                onMouseDown={() => controller.onHover(TransformHandleHoverState.RESIZE_BOTTOM_RIGHT)}
                onMouseLeave={() => controller.onUnhover()}
            />
        </svg>
    );
};
