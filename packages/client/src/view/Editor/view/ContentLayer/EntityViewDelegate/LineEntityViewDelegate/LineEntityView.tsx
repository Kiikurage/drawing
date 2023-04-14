import { Box, ColorPalette, LineEntity } from '@drawing/common';
import { SVGContainer } from '../../../CameraLayer/SVGContainer';
import { adjustLineEdgePoints, computePath } from './util';
import { EditableEntityText } from '../../EditableEntityText';
import { useEntityMap } from '../../../../../hooks/useEntityMap';
import { useMemo } from 'react';
import { useSelectedEntities } from '../../../../../hooks/useSelection';

export const LineEntityView = ({ entity }: { entity: LineEntity }) => {
    const entities = useEntityMap();
    const { linkedEntity1, linkedEntity2 } = useMemo(() => {
        return {
            linkedEntity1: entity.linkedEntityId1 === null ? undefined : entities[entity.linkedEntityId1],
            linkedEntity2: entity.linkedEntityId2 === null ? undefined : entities[entity.linkedEntityId2],
        };
    }, [entities, entity.linkedEntityId1, entity.linkedEntityId2]);
    const selectedEntities = useSelectedEntities();

    const originalLineVisible = selectedEntities.length === 1 && selectedEntities[0].id === entity.id;

    const [p1, p2] = adjustLineEdgePoints(entity, linkedEntity1, linkedEntity2);

    return (
        <>
            {originalLineVisible && (
                <SVGContainer viewport={Box.fromPoints(entity.p1, entity.p2)}>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="10 10"
                        strokeWidth={4}
                        stroke={ColorPalette[entity.palette].strokeColor}
                        opacity={0.3}
                        fill="none"
                        d={computePath(entity.p1, entity.p2, 'none', 'none')}
                    />
                </SVGContainer>
            )}
            <SVGContainer viewport={Box.fromPoints(p1, p2)} html={<EditableEntityText entity={entity} />}>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={8}
                    stroke={ColorPalette[entity.palette].strokeColor}
                    fill="none"
                    d={computePath(p1, p2, entity.arrowHeadType1, entity.arrowHeadType2)}
                />
            </SVGContainer>
        </>
    );
};
