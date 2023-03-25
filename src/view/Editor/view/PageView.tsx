import { css } from '@emotion/react';
import { memo, useMemo } from 'react';
import { useSlice } from '../../hooks/useStore';
import { useEditorController } from '../EditorControllerContext';
import { computeVisibleEntities } from '../util';
import { EntityView } from './EntityView/EntityView';

export const PageView = memo(() => {
    const controller = useEditorController();
    const { page, camera } = useSlice(controller.store, (state) => ({
        page: state.page,
        camera: state.camera,
    }));

    const visibleEntities = useMemo(() => computeVisibleEntities(page.entities, camera), [camera, page.entities]);

    return (
        <div
            css={css`
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
