import { css } from '@emotion/react';
import { useMemo } from 'react';
import { Entity } from '../../../model/entity/Entity';
import { Camera } from '../model/Camera';
import { ContextMenuState } from '../model/ContextMenuState';
import { EntityMap } from '../model/EntityMap';
import { SelectingRangeState } from '../model/SelectingRangeState';
import { computeVisibleEntities } from '../util';
import { EntityBoundingBoxView } from './BoundingBoxView/EntityBoundingBoxView';
import { ContextMenuPopup } from './ContextMenuPopup';
import { SelectingRangeView } from './SelectingRangeView';
import { SelectionView } from './SelectionView/SelectionView';
import { SnapGuide } from './SnapGuide';

export const IndicatorLayer = ({
    camera,
    selectedEntities,
    hoveredEntity,
    contextMenu,
    selectingRange,
}: {
    camera: Camera;
    selectedEntities: EntityMap;
    hoveredEntity: Entity | null;
    contextMenu: ContextMenuState;
    selectingRange: SelectingRangeState;
}) => {
    const entitiesMap = useMemo(() => {
        const map = { ...selectedEntities };
        if (hoveredEntity !== null) {
            map[hoveredEntity.id] = hoveredEntity;
        }
        return map;
    }, [hoveredEntity, selectedEntities]);
    const visibleEntities = useMemo(() => computeVisibleEntities(entitiesMap, camera), [camera, entitiesMap]);

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
                {Object.values(visibleEntities).map((entity) => (
                    <EntityBoundingBoxView entity={entity} camera={camera} key={entity.id} />
                ))}
                <SelectionView selectedEntities={selectedEntities} camera={camera} />
                <SelectingRangeView selectingRange={selectingRange} camera={camera} />
                <SnapGuide />
            </svg>
            <ContextMenuPopup camera={camera} state={contextMenu} />
        </div>
    );
};
