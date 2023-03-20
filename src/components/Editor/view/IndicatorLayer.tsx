import { css } from '@emotion/react';
import { useMemo } from 'react';
import { Box, ModelCordBox } from '../../../model/Box';
import { Entity } from '../../../model/entity/Entity';
import { Point } from '../../../model/Point';
import { Size } from '../../../model/Size';
import { Camera } from '../model/Camera';
import { ContextMenuState } from '../model/ContextMenuState';
import { SelectingRangeState } from '../model/SelectingRangeState';
import { EntityBoundingBoxView } from './BoundingBoxView/EntityBoundingBoxView';
import { ContextMenuPopup } from './ContextMenuPopup';
import { SelectingRangeView } from './SelectingRangeView';
import { SelectionView } from './SelectionView/SelectionView';

export const IndicatorLayer = ({
    camera,
    selectedEntities,
    hoveredEntity,
    contextMenu,
    selectingRange,
}: {
    camera: Camera;
    selectedEntities: Entity[];
    hoveredEntity: Entity | null;
    contextMenu: ContextMenuState;
    selectingRange: SelectingRangeState;
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
                {visibleEntities.map((entity) => (
                    <EntityBoundingBoxView entity={entity} camera={camera} key={entity.id} />
                ))}
                <SelectionView selectedEntities={selectedEntities} camera={camera} />
                <SelectingRangeView selectingRange={selectingRange} camera={camera} />
            </svg>
            <ContextMenuPopup camera={camera} state={contextMenu} />
        </div>
    );
};

function computeVisibleEntities(entities: Entity[], camera: Camera): Entity[] {
    const box1: ModelCordBox = Box.toModel(camera, {
        point: Point.display(0, 0),
        size: Size.display(window.innerWidth, window.innerHeight),
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
