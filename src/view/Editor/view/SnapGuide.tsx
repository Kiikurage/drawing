import { css } from '@linaria/core';
import { memo, useMemo } from 'react';
import { Record } from '../../../lib/Record';
import { Entity } from '../../../model/entity/Entity';
import { Point } from '../../../model/Point';
import { useStore } from '../../hooks/useStore';
import { useEditorController } from '../EditorControllerContext';
import { getSnapPoints, snapPoint } from '../model/SnapUtil';

export const SnapGuide = memo(() => {
    const controller = useEditorController();
    const {
        selectMode: { snapEnabled, entityIds, transforming },
        camera,
        page,
    } = useStore(controller.store);

    const range = Entity.computeBoundingBox(controller.computeSelectedEntities());
    const snapTargets = useMemo(
        () => Record.filter(page.entities, (entity) => !entityIds.includes(entity.id)),
        [page.entities, entityIds]
    );

    const snapResults = useMemo(() => {
        return Object.values(getSnapPoints(range)).flatMap((point) => {
            const result = snapPoint(point, snapTargets, 0);
            return [...result.pairsX, ...result.pairsY];
        });
    }, [range, snapTargets]);

    if (!snapEnabled || !transforming) return null;

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
