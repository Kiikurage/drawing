import { memo } from 'react';
import { LineEntityView } from './LineEntityView';
import { RectEntityView } from './RectEntityView';
import { TextEntityView } from './TextEntityView';
import { Entity } from '@drawing/common';

export const EntityView = memo(({ entity }: { entity: Entity }) => {
    switch (entity.type) {
        case 'rect':
            return <RectEntityView entity={entity} />;
        case 'text':
            return <TextEntityView entity={entity} />;
        case 'line':
            return <LineEntityView entity={entity} />;
        default:
            throw 'Unreachable';
    }
});
