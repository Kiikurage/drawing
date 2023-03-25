import { memo } from 'react';
import { Entity } from '../../../../model/entity/Entity';
import { Camera } from '../../model/Camera';
import { LineEntityBoundingBoxView } from './LineEntityBoundingBoxView';
import { RectBoundingBoxView } from './RectBoundingBoxView';

export const EntityBoundingBoxView = memo(({ camera, entity }: { camera: Camera; entity: Entity }) => {
    if (entity.type === 'line') {
        return <LineEntityBoundingBoxView p1={entity.p1} p2={entity.p2} camera={camera} />;
    }

    return <RectBoundingBoxView box={Entity.getBoundingBox(entity)} camera={camera} />;
});
