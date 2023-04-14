import { Box, LineEntity, Point } from '@drawing/common';
import { useEditorViewController } from '../../../EditorControllerContext';
import { SVGContainer } from '../../../CameraLayer/SVGContainer';
import { css } from '@linaria/core';
import { COLOR_SELECTION } from '../../../../../styles';
import { EdgeHandle } from '../../../SelectionView/Handle';
import { adjustLineEdgePoints, computePath } from './util';
import { useCamera } from '../../../../../hooks/useCamera';
import { useIsSelected } from '../../../../../hooks/useIsSelected';
import { useEntities } from '../../../../../hooks/useEntities';
import { useMemo } from 'react';

export const LineOutlineView = ({ entity }: { entity: LineEntity }) => {
    const controller = useEditorViewController();
    const selected = useIsSelected(entity.id);
    const camera = useCamera();
    const entities = useEntities();
    const { linkedEntity1, linkedEntity2 } = useMemo(() => {
        return {
            linkedEntity1: entity.linkedEntityId1 === null ? undefined : entities[entity.linkedEntityId1],
            linkedEntity2: entity.linkedEntityId2 === null ? undefined : entities[entity.linkedEntityId2],
        };
    }, [entities, entity.linkedEntityId1, entity.linkedEntityId2]);

    const [p1, p2] = adjustLineEdgePoints(entity, linkedEntity1, linkedEntity2);
    const path = computePath(p1, p2, entity.arrowHeadType1, entity.arrowHeadType2);
    const box = Box.fromPoints(p1, p2);
    return (
        <SVGContainer viewport={box}>
            <g
                visibility={selected ? 'visible' : 'hidden'}
                className={css`
                    &:hover {
                        visibility: visible;
                    }
                `}
            >
                <EdgeHandle
                    p1={Point.model(p1.x - box.point.x, p1.y - box.point.y)}
                    p2={Point.model(p2.x - box.point.x, p2.y - box.point.y)}
                    onPointerDown={(ev) => {
                        controller.handlePointerDown(ev.nativeEvent, {
                            type: 'entity',
                            entityId: entity.id,
                        });
                        ev.stopPropagation();
                    }}
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2 / camera.scale}
                    stroke={COLOR_SELECTION}
                    fill="transparent"
                    d={path}
                />
            </g>
        </SVGContainer>
    );
};
