import { memo, useMemo } from 'react';
import { useEditorViewController } from './EditorControllerContext';
import { useSlice } from '../../hooks/useSlice';
import { css } from '@linaria/core';
import { useCamera } from '../../hooks/useCamera';
import { useSelectedEntities, useSelectedEntityIds } from '../../hooks/useSelection';
import { useEntities } from '../../hooks/useEntityMap';
import { getSnapPoints, snapPoint } from '@drawing/common/src/model/SnapUtil';
import { Entity } from '@drawing/common/src/model/page/entity/Entity';
import { Point } from '@drawing/common/src/model/Point';

export const SnapGuide = memo(() => {
    const controller = useEditorViewController();
    const entities = useEntities();
    const selectedEntities = useSelectedEntities();
    const selectedEntityIds = useSelectedEntityIds();

    const snapTargets = useMemo(
        () => entities.filter((entity) => !selectedEntityIds.includes(entity.id)),
        [entities, selectedEntityIds]
    );

    const camera = useCamera();

    const { visible } = useSlice(controller.transformController.store, (state) => ({
        visible: state.snapEnabled && state.snapGuideVisible,
    }));

    const snapResults = useMemo(() => {
        const range = Entity.computeBoundingBox(selectedEntities);

        return Object.values(getSnapPoints(range)).flatMap((point) => {
            const result = snapPoint(point, snapTargets, 0.5);
            return [...result.pairsX, ...result.pairsY];
        });
    }, [selectedEntities, snapTargets]);

    if (!visible) return null;

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
            <g>
                {snapResults.map(([p1, p2], i) => {
                    const p1d = Point.toDisplay(camera, p1);
                    const p2d = Point.toDisplay(camera, p2);

                    return <line key={i} x1={p1d.x} y1={p1d.y} x2={p2d.x} y2={p2d.y} stroke="#F00" strokeWidth={1} />;
                })}
            </g>
        </svg>
    );
});
