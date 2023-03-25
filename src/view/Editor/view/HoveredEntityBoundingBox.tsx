import { memo } from 'react';
import { useSlice } from '../../hooks/useStore';
import { useEditorController } from '../EditorControllerContext';
import { EntityBoundingBoxView } from './BoundingBoxView/EntityBoundingBoxView';

export const HoveredEntityBoundingBox = memo(() => {
    const controller = useEditorController();
    const { hoveredEntity, camera } = useSlice(controller.store, (state) => {
        if (state.hover.type !== 'entity')
            return {
                hoveredEntity: undefined,
                camera: undefined,
            };

        return {
            hoveredEntity: state.page.entities[state.hover.entityId],
            camera: state.camera,
        };
    });

    if (hoveredEntity === undefined || camera === undefined) return null;

    return <EntityBoundingBoxView entity={hoveredEntity} camera={camera} />;
});
