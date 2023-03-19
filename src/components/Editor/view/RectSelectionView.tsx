import { css } from '@emotion/react';
import { Box } from '../../../model/Box';
import { Entity } from '../../../model/entity/Entity';
import { COLOR_SELECTION } from '../../styles';
import { useEditorController } from '../EditorControllerContext';
import { Camera } from '../model/Camera';
import { TransformHandleHoverState } from '../model/HoverState';

export const RectSelectionView = ({ camera, selectedEntities }: { camera: Camera; selectedEntities: Entity[] }) => {
    const controller = useEditorController();

    const boundingBox = Box.computeBoundingBox(selectedEntities);

    return (
        <svg
            css={css`
                position: absolute;
                left: ${(boundingBox.x - camera.point.x) * camera.scale - 100}px;
                top: ${(boundingBox.y - camera.point.y) * camera.scale - 100}px;
            `}
            width={boundingBox.width * camera.scale + 200}
            height={boundingBox.height * camera.scale + 200}
        >
            <rect
                cursor="move"
                pointerEvents="all"
                x="100"
                y="100"
                width={boundingBox.width * camera.scale}
                height={boundingBox.height * camera.scale}
                fill="transparent"
                stroke={COLOR_SELECTION}
                strokeWidth={1.5}
                onMouseDown={() => controller.onHover(TransformHandleHoverState.TRANSLATE)}
                onMouseLeave={() => controller.onUnhover()}
            />
            <rect
                cursor="nwse-resize"
                pointerEvents="all"
                x="96"
                y="96"
                width="9"
                height="9"
                fill="#fff"
                stroke={COLOR_SELECTION}
                strokeWidth={1.5}
                onMouseOver={() => controller.onHover(TransformHandleHoverState.RESIZE_TOP_LEFT)}
                onMouseLeave={() => controller.onUnhover()}
            />
            <rect
                cursor="ns-resize"
                pointerEvents="all"
                x="105"
                y="96"
                width={boundingBox.width * camera.scale - 8}
                height="9"
                fill="transparent"
                strokeWidth={1.5}
                onMouseOver={() => controller.onHover(TransformHandleHoverState.RESIZE_TOP)}
                onMouseLeave={() => controller.onUnhover()}
            />
            <rect
                cursor="nesw-resize"
                pointerEvents="all"
                x={96 + boundingBox.width * camera.scale}
                y="96"
                width="9"
                height="9"
                fill="#fff"
                stroke={COLOR_SELECTION}
                strokeWidth={1.5}
                onMouseOver={() => controller.onHover(TransformHandleHoverState.RESIZE_TOP_RIGHT)}
                onMouseLeave={() => controller.onUnhover()}
            />
            <rect
                cursor="ew-resize"
                pointerEvents="all"
                x="96"
                y="105"
                width="9"
                height={boundingBox.height * camera.scale - 8}
                fill="transparent"
                strokeWidth={1.5}
                onMouseOver={() => controller.onHover(TransformHandleHoverState.RESIZE_LEFT)}
                onMouseLeave={() => controller.onUnhover()}
            />
            <rect
                cursor="ew-resize"
                pointerEvents="all"
                x={96 + boundingBox.width * camera.scale}
                y="105"
                width="9"
                height={boundingBox.height * camera.scale - 8}
                fill="transparent"
                strokeWidth={1.5}
                onMouseDown={() => controller.onHover(TransformHandleHoverState.RESIZE_RIGHT)}
                onMouseLeave={() => controller.onUnhover()}
            />
            <rect
                cursor="nesw-resize"
                pointerEvents="all"
                x="96"
                y={96 + boundingBox.height * camera.scale}
                width="9"
                height="9"
                fill="#fff"
                stroke={COLOR_SELECTION}
                strokeWidth={1.5}
                onMouseDown={() => controller.onHover(TransformHandleHoverState.RESIZE_BOTTOM_LEFT)}
                onMouseLeave={() => controller.onUnhover()}
            />
            <rect
                cursor="ns-resize"
                pointerEvents="all"
                x="105"
                y={96 + boundingBox.height * camera.scale}
                width={boundingBox.width * camera.scale - 8}
                height="9"
                fill="transparent"
                strokeWidth={1.5}
                onMouseDown={() => controller.onHover(TransformHandleHoverState.RESIZE_BOTTOM)}
                onMouseLeave={() => controller.onUnhover()}
            />
            <rect
                cursor="nwse-resize"
                pointerEvents="all"
                x={96 + boundingBox.width * camera.scale}
                y={96 + boundingBox.height * camera.scale}
                width="9"
                height="9"
                fill="#fff"
                stroke={COLOR_SELECTION}
                strokeWidth={1.5}
                onMouseDown={() => controller.onHover(TransformHandleHoverState.RESIZE_BOTTOM_RIGHT)}
                onMouseLeave={() => controller.onUnhover()}
            />
        </svg>
    );
};
