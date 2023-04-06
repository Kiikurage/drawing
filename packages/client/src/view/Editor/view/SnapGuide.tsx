import { memo, useMemo } from 'react';
import { useEditorController } from '../EditorControllerContext';
import { useSlice } from '../../hooks/useStore';
import { Entity, getSnapPoints, Point, Record, snapPoint } from '@drawing/common';
import { css } from '@linaria/core';

export const SnapGuide = memo(() => {
    const controller = useEditorController();
    const { visible, selectedEntityIds, camera, page } = useSlice(controller.store, (state) => ({
        visible: state.snap.enabled && state.snap.visible,
        selectedEntityIds: state.selectMode.entityIds,
        camera: state.camera,
        page: state.page,
    }));

    const range = Entity.computeBoundingBox(controller.computeSelectedEntities());
    const snapTargets = useMemo(
        () => Record.filter(page.entities, (entity) => !selectedEntityIds.includes(entity.id)),
        [page.entities, selectedEntityIds]
    );

    const snapResults = useMemo(() => {
        return Object.values(getSnapPoints(range)).flatMap((point) => {
            const result = snapPoint(point, snapTargets, 0);
            return [...result.pairsX, ...result.pairsY];
        });
    }, [range, snapTargets]);

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
