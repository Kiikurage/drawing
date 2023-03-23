import { useMemo } from 'react';
import { Record } from '../../../lib/Record';
import { Entity } from '../../../model/entity/Entity';
import { Point } from '../../../model/Point';
import { useStore } from '../../hooks/useStore';
import { useEditorController } from '../EditorControllerContext';
import { getSnap } from '../model/session/SnapUtil';
import { TransformSession } from '../model/session/TransformSession';

export const SnapGuide = () => {
    const controller = useEditorController();
    const { sessionType, snapEnabled, camera, page, selectedEntityIds } = useStore(controller.store);

    const range = Entity.computeBoundingBox(controller.computeSelectedEntities());
    const snapTargets = useMemo(
        () => Record.filter(page.entities, (entity) => !selectedEntityIds.includes(entity.id)),
        [page.entities, selectedEntityIds]
    );

    const DELTA = 1;
    const snapResults = useMemo(() => {
        return [
            getSnap(range.point, snapTargets, 'x', DELTA),
            getSnap(range.point, snapTargets, 'y', DELTA),
            getSnap(Point.model(range.point.x, range.point.y + range.size.height), snapTargets, 'x', DELTA),
            getSnap(Point.model(range.point.x, range.point.y + range.size.height), snapTargets, 'y', DELTA),
            getSnap(Point.model(range.point.x + range.size.width, range.point.y), snapTargets, 'x', DELTA),
            getSnap(Point.model(range.point.x + range.size.width, range.point.y), snapTargets, 'y', DELTA),
            getSnap(
                Point.model(range.point.x + range.size.width, range.point.y + range.size.height),
                snapTargets,
                'x',
                DELTA
            ),
            getSnap(
                Point.model(range.point.x + range.size.width, range.point.y + range.size.height),
                snapTargets,
                'y',
                DELTA
            ),
            getSnap(
                Point.model(range.point.x + range.size.width / 2, range.point.y + range.size.height / 2),
                snapTargets,
                'x',
                DELTA
            ),
            getSnap(
                Point.model(range.point.x + range.size.width / 2, range.point.y + range.size.height / 2),
                snapTargets,
                'y',
                DELTA
            ),
        ].flatMap((result) => result.points.map((point) => [result.originPoint, point] as const));
    }, [range.point, range.size.height, range.size.width, snapTargets]);

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
