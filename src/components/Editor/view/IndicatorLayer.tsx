import { css } from '@emotion/react';
import { Entity } from '../../../model/Entity';
import { RectEntity } from '../../../model/RectEntity';
import { Camera } from '../model/Camera';
import { EntityBoundingBoxView } from './EntityBoundingBoxView';
import { SelectionView } from './SelectionView';

export const IndicatorLayer = ({
    camera,
    selectedEntities,
    hoveredEntity,
}: {
    camera: Camera;
    selectedEntities: Entity[];
    hoveredEntity: Entity | null;
}) => {
    const entitiesSet = new Set<RectEntity>();

    for (const entity of selectedEntities) {
        if (entity.type !== 'rect') continue;
        entitiesSet.add(entity);
    }

    if (hoveredEntity !== null && hoveredEntity.type === 'rect') {
        entitiesSet.add(hoveredEntity);
    }

    const entities = Array.from(entitiesSet);
    if (entities.length === 0) return null;

    return (
        <div
            css={css`
                pointer-events: none;
                transform-origin: 0 0;
            `}
        >
            {entities.map((entity, i) => (
                <EntityBoundingBoxView entity={entity} camera={camera} key={i} />
            ))}
            {selectedEntities.length > 0 && <SelectionView selectedEntities={selectedEntities} camera={camera} />}
        </div>
    );
};
