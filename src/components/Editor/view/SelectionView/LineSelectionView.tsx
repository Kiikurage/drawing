import { Box } from '../../../../model/Box';
import { Entity } from '../../../../model/entity/Entity';
import { LineEntity } from '../../../../model/entity/LineEntity';
import { ModelCordPoint, Point } from '../../../../model/Point';
import { COLOR_SELECTION } from '../../../styles';
import { useEditorController } from '../../EditorControllerContext';
import { Camera } from '../../model/Camera';
import { TransformHandleHoverState } from '../../model/HoverState';
import { ResizeHandle } from './ResizeHandle';

export const LineSelectionView = ({ camera, entity }: { camera: Camera; entity: LineEntity }) => {
    const controller = useEditorController();

    const modelBoundingBox = Entity.getBoundingBox(entity);
    const modelBoundingBoxCamera = { ...camera, point: modelBoundingBox.point };

    const displayBoundingBox = Box.toDisplay(camera, modelBoundingBox);
    const p1 = Point.toDisplay(modelBoundingBoxCamera, entity.p1);
    const p2 = Point.toDisplay(modelBoundingBoxCamera, entity.p2);

    return (
        <g transform={`translate(${displayBoundingBox.point.x},${displayBoundingBox.point.y})`}>
            <path
                cursor="move"
                d={`M${p1.x},${p1.y} L${p2.x},${p2.y}`}
                pointerEvents="all"
                stroke={COLOR_SELECTION}
                strokeWidth={1.5}
                onMouseDown={() => controller.onHover(TransformHandleHoverState.TRANSLATE)}
                onMouseLeave={() => controller.onUnhover()}
            />
            <ResizeHandle cursor="move" x={p1.x} y={p1.y} hover={getHoverState(entity.p1, entity.p2)} />
            <ResizeHandle cursor="move" x={p2.x} y={p2.y} hover={getHoverState(entity.p2, entity.p1)} />
        </g>
    );
};

function getHoverState(targetPoint: ModelCordPoint, anchorPoint: ModelCordPoint): TransformHandleHoverState {
    if (targetPoint.x < anchorPoint.x) {
        if (targetPoint.y < anchorPoint.y) {
            return TransformHandleHoverState.RESIZE_TOP_LEFT;
        } else {
            return TransformHandleHoverState.RESIZE_BOTTOM_LEFT;
        }
    } else {
        if (targetPoint.y < anchorPoint.y) {
            return TransformHandleHoverState.RESIZE_TOP_RIGHT;
        } else {
            return TransformHandleHoverState.RESIZE_BOTTOM_RIGHT;
        }
    }
}
