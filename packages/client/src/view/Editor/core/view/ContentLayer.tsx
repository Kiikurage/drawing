import { css } from '@linaria/core';
import { memo, useMemo } from 'react';
import { useSlice } from '../../../hooks/useStore';
import { useEditorController } from './EditorControllerContext';
import { EntityView } from './EntityView/EntityView';
import { Box, Camera, EntityMap } from '@drawing/common';

export const ContentLayer = memo(() => {
    const controller = useEditorController();
    const { page, camera } = useSlice(controller.store, (state) => ({
        page: state.page,
        camera: state.camera,
    }));

    const visibleEntities = useMemo(() => computeVisibleEntities(page.entities, camera), [camera, page.entities]);

    return (
        <div
            className={css`
                transform-origin: 0 0;
                width: 100%;
                height: 100%;
            `}
            style={{
                transform: `scale(${camera.scale}) translate(${-camera.point.x}px, ${-camera.point.y}px)`,
            }}
        >
            {Object.values(visibleEntities).map((entity) => (
                <EntityView entity={entity} key={entity.id} />
            ))}
        </div>
    );
});

function computeVisibleEntities(entities: EntityMap, camera: Camera): EntityMap {
    const viewport = Box.toModel(camera, Box.display(0, 0, window.innerWidth, window.innerHeight));

    return EntityMap.filterByRange(entities, viewport);
}
