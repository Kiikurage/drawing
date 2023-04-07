import { useEditorController } from '../EditorControllerContext';
import { Box, Camera, Entity, HoverState, LineEntity, Point } from '@drawing/common';
import { css } from '@linaria/core';
import { COLOR_SELECTION } from '../../../../styles';
import { ResizeHandle } from './ResizeHandle';

export const LineSelectionView = ({ camera, entity }: { camera: Camera; entity: LineEntity }) => {
    const controller = useEditorController();

    const modelBoundingBox = Entity.getBoundingBox(entity);
    const modelBoundingBoxCamera = { ...camera, point: modelBoundingBox.point };

    const displayBoundingBox = Box.toDisplay(camera, modelBoundingBox);
    const p1 = Point.toDisplay(modelBoundingBoxCamera, entity.p1);
    const p2 = Point.toDisplay(modelBoundingBoxCamera, entity.p2);

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
            <g transform={`translate(${displayBoundingBox.point.x},${displayBoundingBox.point.y})`}>
                <path
                    cursor="move"
                    d={`M${p1.x},${p1.y} L${p2.x},${p2.y}`}
                    pointerEvents="all"
                    stroke={COLOR_SELECTION}
                    strokeWidth={1.5}
                    onMouseOver={() => controller.onHover(HoverState.TRANSLATE_HANDLE)}
                    onMouseLeave={() => controller.onUnhover()}
                />
                <ResizeHandle cursor="move" x={p1.x} y={p1.y} hover={HoverState.RESIZE_HANDLE_P1} />
                <ResizeHandle cursor="move" x={p2.x} y={p2.y} hover={HoverState.RESIZE_HANDLE_P2} />
            </g>
        </svg>
    );
};
