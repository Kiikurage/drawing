import { Box } from '../../../../model/Box';
import { Entity } from '../../../../model/entity/Entity';
import { COLOR_SELECTION } from '../../../styles';
import { useEditorController } from '../../EditorControllerContext';
import { Camera } from '../../model/Camera';
import { TransformHandleHoverState } from '../../model/HoverState';
import { InvisibleResizeHandle, ResizeHandle } from './ResizeHandle';

export const RectSelectionView = ({ camera, selectedEntities }: { camera: Camera; selectedEntities: Entity[] }) => {
    const controller = useEditorController();

    const {
        point: { x, y },
        size: { width, height },
    } = Box.toDisplay(camera, Entity.computeBoundingBox(selectedEntities));

    return (
        <g transform={`translate(${x},${y})`}>
            <rect
                cursor="move"
                pointerEvents="all"
                width={width}
                height={height}
                fill="none"
                stroke={COLOR_SELECTION}
                strokeWidth={1.5}
                onMouseOver={() => controller.onHover(TransformHandleHoverState.TRANSLATE)}
                onMouseLeave={() => controller.onUnhover()}
            />
            <InvisibleResizeHandle cursor="ns-resize" width={width} hover={TransformHandleHoverState.RESIZE_TOP} />
            <InvisibleResizeHandle cursor="ew-resize" height={height} hover={TransformHandleHoverState.RESIZE_LEFT} />
            <InvisibleResizeHandle
                cursor="ew-resize"
                x={width}
                height={height}
                hover={TransformHandleHoverState.RESIZE_RIGHT}
            />
            <InvisibleResizeHandle
                cursor="ns-resize"
                y={height}
                width={width}
                hover={TransformHandleHoverState.RESIZE_BOTTOM}
            />
            <ResizeHandle cursor="nwse-resize" hover={TransformHandleHoverState.RESIZE_TOP_LEFT} />
            <ResizeHandle cursor="nesw-resize" x={width} hover={TransformHandleHoverState.RESIZE_TOP_RIGHT} />
            <ResizeHandle cursor="nesw-resize" y={height} hover={TransformHandleHoverState.RESIZE_BOTTOM_LEFT} />
            <ResizeHandle
                cursor="nwse-resize"
                x={width}
                y={height}
                hover={TransformHandleHoverState.RESIZE_BOTTOM_RIGHT}
            />
        </g>
    );
};
