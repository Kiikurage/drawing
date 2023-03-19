import { css } from '@emotion/react';
import { Entity } from '../../../model/entity/Entity';
import { LineEntity } from '../../../model/entity/LineEntity';
import { ModelCordPoint, Point } from '../../../model/Point';
import { COLOR_SELECTION } from '../../styles';
import { useEditorController } from '../EditorControllerContext';
import { Camera } from '../model/Camera';
import { TransformHandleHoverState } from '../model/HoverState';

export const LineSelectionView = ({ camera, entity }: { camera: Camera; entity: LineEntity }) => {
    const controller = useEditorController();

    const boundingBox = Entity.getBoundingBox(entity);
    const p = Point.toDisplay(camera, ModelCordPoint(boundingBox));
    const p1 = Point.toDisplay(camera, entity.p1);
    const p2 = Point.toDisplay(camera, entity.p2);

    return (
        <svg
            css={css`
                position: absolute;
                left: ${p.x - 100}px;
                top: ${p.y - 100}px;
            `}
            width={boundingBox.width * camera.scale + 200}
            height={boundingBox.height * camera.scale + 200}
        >
            <path
                cursor="move"
                d={`M${p1.x - p.x + 100},${p1.y - p.y + 100} L${p2.x - p.x + 100},${p2.y - p.y + 100}`}
                pointerEvents="all"
                stroke={COLOR_SELECTION}
                strokeWidth={1.5}
                onMouseDown={() => controller.onHover(TransformHandleHoverState.TRANSLATE)}
                onMouseLeave={() => controller.onUnhover()}
            />
            <rect
                cursor="move"
                pointerEvents="all"
                x={p1.x - p.x + 100 - 4}
                y={p1.y - p.y + 100 - 4}
                width="9"
                height="9"
                fill="#fff"
                stroke={COLOR_SELECTION}
                strokeWidth={1.5}
                onMouseOver={() => controller.onHover(getHoverState(p1, p2))}
                onMouseLeave={() => controller.onUnhover()}
            />
            <rect
                cursor="move"
                pointerEvents="all"
                x={p2.x - p.x + 100 - 4}
                y={p2.y - p.y + 100 - 4}
                width="9"
                height="9"
                fill="#fff"
                stroke={COLOR_SELECTION}
                strokeWidth={1.5}
                onMouseOver={() => controller.onHover(getHoverState(p2, p1))}
                onMouseLeave={() => controller.onUnhover()}
            />
        </svg>
    );
};

function getHoverState(targetPoint: Point, anchorPoint: Point): TransformHandleHoverState {
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
