import { css } from '@emotion/react';
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

    const boundingBox = Box.toDisplay(camera, Entity.getBoundingBox(entity));
    const p1 = Point.toDisplay(camera, entity.p1);
    const p2 = Point.toDisplay(camera, entity.p2);

    return (
        <svg
            css={css`
                position: absolute;
                left: ${boundingBox.point.x - 100}px;
                top: ${boundingBox.point.y - 100}px;
            `}
            width={boundingBox.size.width + 200}
            height={boundingBox.size.height + 200}
        >
            <path
                cursor="move"
                d={`M${p1.x - boundingBox.point.x + 100},${p1.y - boundingBox.point.y + 100} L${
                    p2.x - boundingBox.point.x + 100
                },${p2.y - boundingBox.point.y + 100}`}
                pointerEvents="all"
                stroke={COLOR_SELECTION}
                strokeWidth={1.5}
                onMouseDown={() => controller.onHover(TransformHandleHoverState.TRANSLATE)}
                onMouseLeave={() => controller.onUnhover()}
            />
            <ResizeHandle
                cursor="move"
                x={p1.x - boundingBox.point.x + 100 - 4}
                y={p1.y - boundingBox.point.y + 100 - 4}
                onMouseOver={() => controller.onHover(getHoverState(entity.p1, entity.p2))}
                onMouseLeave={() => controller.onUnhover()}
            />
            <ResizeHandle
                cursor="move"
                x={p2.x - boundingBox.point.x + 100 - 4}
                y={p2.y - boundingBox.point.y + 100 - 4}
                onMouseOver={() => controller.onHover(getHoverState(entity.p2, entity.p1))}
                onMouseLeave={() => controller.onUnhover()}
            />
        </svg>
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
