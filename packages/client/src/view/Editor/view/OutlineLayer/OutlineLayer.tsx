import { memo } from 'react';
import { OutlineView } from './OutlineView';
import { useCamera } from '../../../hooks/useCamera';
import { useLayout } from '../../../hooks/useLayout';
import { Box } from '@drawing/common/src/model/Box';
import { Entity } from '@drawing/common/src/model/page/entity/Entity';

export const OutlineLayer = memo(() => {
    const entities = useLayout();
    const camera = useCamera();

    const viewport = Box.toModel(camera, Box.display(0, 0, window.innerWidth, window.innerHeight));
    return (
        <>
            {entities
                .filter((entity) => Box.isOverlap(Entity.getBoundingBox(entity), viewport))
                .map((entity) => (
                    <OutlineView entity={entity} key={entity.id} />
                ))}
        </>
    );
});
