import { css } from '@emotion/react';
import { useMemo } from 'react';
import { Box, ModelCordBox } from '../../../model/Box';
import { Entity } from '../../../model/entity/Entity';
import { Point } from '../../../model/Point';
import { Size } from '../../../model/Size';
import { Camera } from '../model/Camera';
import { ContextMenuState } from '../model/ContextMenuState';
import { EntityBoundingBoxView } from './BoundingBoxView/EntityBoundingBoxView';
import { ContextMenuPopup } from './ContextMenuPopup';
import { SelectionView } from './SelectionView/SelectionView';

export const IndicatorLayer = ({
    camera,
    selectedEntities,
    hoveredEntity,
    contextMenu,
}: {
    camera: Camera;
    selectedEntities: Entity[];
    hoveredEntity: Entity | null;
    contextMenu: ContextMenuState;
}) => {
    const entitiesSet = new Set<Entity>(selectedEntities);

    if (hoveredEntity !== null) {
        entitiesSet.add(hoveredEntity);
    }

    const entities = Array.from(entitiesSet);
    const visibleEntities = useMemo(() => computeVisibleEntities(entities, camera), [camera, entities]);

    return (
        <div
            css={css`
                position: absolute;
                inset: 0;
            `}
        >
            <svg
                css={css`
                    position: absolute;
                    top: 0;
                    left: 0;
                `}
                width="100%"
                height="100%"
            >
                {visibleEntities.map((entity, i) => (
                    <EntityBoundingBoxView entity={entity} camera={camera} key={i} />
                ))}
                <SelectionView selectedEntities={selectedEntities} camera={camera} />
            </svg>
            <ContextMenuPopup camera={camera} state={contextMenu} />
        </div>
    );
};

function computeVisibleEntities(entities: Entity[], camera: Camera): Entity[] {
    const box1: ModelCordBox = Box.toModel(camera, {
        point: Point.display({ x: 0, y: 0 }),
        size: Size.display({ width: window.innerWidth, height: window.innerHeight }),
    });

    return entities.filter((entity) => {
        const box2 = Entity.getBoundingBox(entity);

        return (
            box1.point.x < box2.point.x + box2.size.width &&
            box2.point.x < box1.point.x + box1.size.width &&
            box1.point.y < box2.point.y + box2.size.height &&
            box2.point.y < box1.point.y + box1.size.height
        );
    });
}
