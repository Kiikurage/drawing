import { memo } from 'react';
import { EntityView } from './EntityView';
import { useCamera } from '../../../hooks/useCamera';
import { useLayout } from '../../../hooks/useLayout';
import { Box } from '@drawing/common/src/model/Box';
import { Entity } from '@drawing/common/src/model/page/entity/Entity';

export const ContentLayer = memo(() => {
    const entities = useLayout();
    const camera = useCamera();

    const viewport = Box.toModel(camera, Box.display(0, 0, window.innerWidth, window.innerHeight));
    return (
        <>
            {entities
                .filter((entity) => Box.isOverlap(Entity.getBoundingBox(entity), viewport))
                .map((entity) => (
                    <EntityView entity={entity} key={entity.id} />
                ))}
        </>
    );
});
