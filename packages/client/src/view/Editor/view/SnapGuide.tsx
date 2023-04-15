import { memo, useMemo } from 'react';
import { useEditorViewController } from './EditorControllerContext';
import { useSlice } from '../../hooks/useSlice';
import { useCamera } from '../../hooks/useCamera';
import { useSelectedEntities, useSelectedEntityIds } from '../../hooks/useSelection';
import { useEntities } from '../../hooks/useEntityMap';
import { getSnapPoints, snapPoint } from '@drawing/common/src/model/SnapUtil';
import { Entity } from '@drawing/common/src/model/page/entity/Entity';
import { SVGContainer } from '@drawing/client/src/view/Editor/view/CameraLayer/SVGContainer';
import { Box } from '@drawing/common/src/model/Box';

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

    if (!visible || snapResults.length === 0) return null;

    const box = snapResults.map(([p1, p2]) => Box.fromPoints(p1, p2)).reduce((b1, b2) => Box.union(b1, b2));
    const {
        point: { x: x0, y: y0 },
    } = box;

    return (
        <SVGContainer viewport={box}>
            {snapResults.map(([p1, p2], i) => {
                return (
                    <line
                        key={i}
                        x1={p1.x - x0}
                        y1={p1.y - y0}
                        x2={p2.x - x0}
                        y2={p2.y - y0}
                        stroke="#F00"
                        strokeWidth={1}
                    />
                );
            })}
        </SVGContainer>
    );
});
