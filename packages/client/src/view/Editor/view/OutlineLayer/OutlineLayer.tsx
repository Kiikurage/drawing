import { memo } from 'react';
import { useSlice } from '../../../hooks/useSlice';
import { useEditorViewController } from '../EditorControllerContext';
import { Box, Entity } from '@drawing/common';
import { OutlineView } from './OutlineView';
import { useCamera } from '../../../hooks/useCamera';

export const OutlineLayer = memo(() => {
    const controller = useEditorViewController();
    const { layouts, entities } = useSlice(controller.pageController.store, (state) => ({
        layouts: state.page.layouts,
        entities: state.page.entities,
    }));
    const camera = useCamera();

    const viewport = Box.toModel(camera, Box.display(0, 0, window.innerWidth, window.innerHeight));
    return (
        <>
            {layouts
                .map((entityId) => entities[entityId])
                .filter((entity) => Box.isOverlap(Entity.getBoundingBox(entity), viewport))
                .map((entity) => (
                    <OutlineView entity={entity} key={entity.id} />
                ))}
        </>
    );
});
