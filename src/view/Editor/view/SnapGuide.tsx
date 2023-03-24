import { useMemo } from 'react';
import { Record } from '../../../lib/Record';
import { Entity } from '../../../model/entity/Entity';
import { Point } from '../../../model/Point';
import { useStore } from '../../hooks/useStore';
import { useEditorController } from '../EditorControllerContext';
import { getSnap, getSnapPoints } from '../model/session/SnapUtil';
import { TransformSession } from '../model/session/TransformSession';

export const SnapGuide = () => {
    const controller = useEditorController();
    const { sessionType, snapEnabled, camera, page, selectedEntityIds } = useStore(controller.store);

    const range = Entity.computeBoundingBox(controller.computeSelectedEntities());
    const snapTargets = useMemo(
        () => Record.filter(page.entities, (entity) => !selectedEntityIds.includes(entity.id)),
        [page.entities, selectedEntityIds]
    );

    const snapResults = useMemo(() => {
        return Object.values(getSnapPoints(range)).flatMap((point) =>
            (['x', 'y'] as const).flatMap((direction) => getSnap(point, snapTargets, direction, 0).pairs)
        );
    }, [range, snapTargets]);

    if (!snapEnabled || sessionType !== TransformSession.TYPE) return null;

    return (
        <g>
            {snapResults.map(([p1, p2], i) => {
                const p1d = Point.toDisplay(camera, p1);
                const p2d = Point.toDisplay(camera, p2);

                return <line key={i} x1={p1d.x} y1={p1d.y} x2={p2d.x} y2={p2d.y} stroke="#F00" strokeWidth={1} />;
            })}
        </g>
    );
};
